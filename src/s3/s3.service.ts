import { Injectable, Logger } from '@nestjs/common';
import { PutObjectCommand, S3Client } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { nanoid } from 'nanoid';
import { S3UploadFilesDTO } from './dto/s3.dto';

@Injectable()
export class S3Service {
  private readonly s3Client: S3Client;
  private readonly logger = new Logger(S3Service.name);

  constructor(private readonly configService: ConfigService) {
    this.s3Client = new S3Client({
      region: this.configService.getOrThrow('AWS_S3_REGION'),
    });
  }

  async upload(dto: S3UploadFilesDTO): Promise<string[]> {
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
      } catch (err) {
        this.logger.error('Cannot save file to s3', err);
        throw err;
      }
    });

    const data = await Promise.all(promises);
    return data;
  }
}
