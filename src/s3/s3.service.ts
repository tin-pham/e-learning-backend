import { Injectable, Logger } from '@nestjs/common';
import {
  DeleteObjectCommand,
  PutObjectCommand,
  PutObjectCommandOutput,
  S3Client,
} from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { S3DeleteDTO, S3UploadDTO } from './dto/s3.dto';
import { S3UploadRO } from './ro/s3.ro';

@Injectable()
export class S3Service extends BaseService {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly configService: ConfigService,
  ) {
    super(elasticLogger);
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
    });
  }

  async bulkUpload(dto: S3UploadDTO, decoded: IJwtPayload): Promise<string[]> {
    const actorId = decoded.userId;
    const bucket = this.configService.getOrThrow('AWS_S3_BUCKET');

    const sanitizeFilename = (filename: string) => {
      // Remove special characters and replace spaces with underscores
      return filename.replace(/[^\w.-]/g, '_');
    };

    const promises = dto.files.map(async (file) => {
      const sanitizedFilename = sanitizeFilename(file.originalName);
      const key = `${dto.directoryPath}/${nanoid()}-${sanitizedFilename}`;
      const command = new PutObjectCommand({
        Bucket: bucket,
        Key: key,
        Body: file.buffer,
        ACL: 'public-read',
      });

      try {
        const response = await this.s3Client.send(command);
        if (response.$metadata.httpStatusCode === 200) {
          const url = `https://${bucket}.s3.${this.configService.getOrThrow(
            'AWS_S3_REGION',
          )}.amazonaws.com/${key}`;
          return url;
        }
        throw new Error('File not saved to s3');
      } catch (error) {
        const { code, status, message } = EXCEPTION.S3.UPLOAD_FAILED;
        this.logger.error('Cannot save file to s3', error);
        this.throwException({ code, status, message, actorId });
      }
    });

    const data = await Promise.all(promises);
    return this.success({
      classRO: S3UploadRO,
      response: { urls: data },
      message: 'File saved to s3',
      actorId,
    });
  }

  async bulkDelete(dto: S3DeleteDTO, decoded: IJwtPayload): Promise<void> {
    const actorId = decoded.userId;

    dto.urls.map(async (url) => {
      const key = url.split('.amazonaws.com/')[1];

      const deleteParams = {
        Bucket: this.configService.getOrThrow('AWS_S3_BUCKET'),
        Key: key,
      };

      try {
        const response: PutObjectCommandOutput = await this.s3Client.send(
          new DeleteObjectCommand(deleteParams),
        );
        if (response.$metadata.httpStatusCode === 204) {
          return url;
        }
        throw new Error('File not delete from s3');
      } catch (err) {
        const { code, status, message } = EXCEPTION.S3.DELETE_FAILED;
        this.logger.error('Cannot delete file from s3', err);
        this.throwException({ code, status, message, actorId });
      }
    });
  }
}
