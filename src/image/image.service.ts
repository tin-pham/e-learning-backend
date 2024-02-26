import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { S3Service } from '../s3/s3.service';
import { ImageRepository } from './image.repository';
import { ImageStoreDTO } from './dto/image.dto';
import { ImageEntity } from './image.entity';
import { S3UploadRO } from '../s3/ro/s3.ro';
import { ImageDeleteRO, ImageStoreRO } from './ro/image.ro';
import { DatabaseService } from 'src/database';

@Injectable()
export class ImageService extends BaseService {
  private readonly logger = new Logger(ImageService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly s3Service: S3Service,
    private readonly imageRepository: ImageRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: ImageStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let s3Response: S3UploadRO;
    const response = new ImageStoreRO();
    const entity = new ImageEntity({
      url: s3Response.data[0].url,
      name: s3Response.data[0].name,
      type: s3Response.data[0].type,
      size: s3Response.data[0].size,
      createdBy: actorId,
    });

    try {
      await this.database.transaction().execute(async (transaction) => {
        const image = await this.imageRepository.insertWithTransaction(transaction, entity);
        s3Response = await this.s3Service.bulkUpload(dto, decoded);

        response.id = image.id;
        response.url = image.url;
        response.name = image.name;
        response.type = image.type;
        response.size = image.size;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.IMAGE.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ImageStoreRO,
      response,
      message: 'Store image successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { image } = await this.validateDelete(id, actorId);

    const response = new ImageDeleteRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Delete image metadata
        await this.imageRepository.deleteWithTransaction(transaction, id, actorId);
        // Delete s3 image
        await this.s3Service.bulkDelete({ urls: [image.url] }, decoded);

        response.id = image.id;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.IMAGE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ImageDeleteRO,
      response,
      message: 'Delete file successfully',
      actorId,
    });
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const image = await this.imageRepository.findOneById(id);
    if (!image) {
      const { code, status, message } = EXCEPTION.IMAGE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return { image };
  }
}
