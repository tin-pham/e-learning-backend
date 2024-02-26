import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { S3Service } from '../s3/s3.service';
import { S3UploadRO } from '../s3/ro/s3.ro';
import { DatabaseService } from 'src/database';
import { ImageRepository } from 'src/image/image.repository';
import { UserImageUpsertDTO } from './dto/user-image.dto';
import { UserImageDeleteRO, UserImageUpsertRO } from './ro/user-image.ro';
import { ImageEntity } from '../image/image.entity';
import { UserImageRepository } from './user-image.repository';

@Injectable()
export class UserImageService extends BaseService {
  private readonly logger = new Logger(UserImageService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly s3Service: S3Service,
    private readonly imageRepository: ImageRepository,
    private readonly userImageRepository: UserImageRepository,
  ) {
    super(elasticLogger);
  }

  async upsert(dto: UserImageUpsertDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let s3Response: S3UploadRO;
    const response = new UserImageUpsertRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Clear old image
        const deletedUserImage = await this.userImageRepository.deleteByUserIdWithTransaction(transaction, decoded.userId, actorId);
        if (deletedUserImage) {
          const deletedImage = await this.imageRepository.deleteWithTransaction(transaction, deletedUserImage.imageId, actorId);
          await this.s3Service.bulkDelete({ urls: [deletedImage.url] }, decoded);
        }
        // Store new image
        s3Response = await this.s3Service.bulkUpload({ ...dto, directoryPath: 'user' }, decoded);
        const entity = new ImageEntity({
          url: s3Response.data[0].url,
          name: s3Response.data[0].name,
          type: s3Response.data[0].type,
          size: s3Response.data[0].size,
          createdBy: actorId,
        });
        const image = await this.imageRepository.insertWithTransaction(transaction, entity);
        await this.userImageRepository.insertWithTransaction(transaction, { userId: decoded.userId, imageId: image.id });

        response.id = image.id;
        response.url = image.url;
        response.name = image.name;
        response.type = image.type;
        response.size = image.size;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.IMAGE.STORE_FAILED;

      if (s3Response) {
        await this.s3Service.bulkDelete({ urls: [s3Response.data[0].url] }, decoded);
      }
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: UserImageUpsertRO,
      response,
      message: 'Store user image successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { image } = await this.validateDelete(id, actorId);

    const response = new UserImageDeleteRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Delete image metadata
        const deletedImage = await this.imageRepository.deleteWithTransaction(transaction, id, actorId);
        // Delete user image
        await this.userImageRepository.deleteByUserIdAndImageIdWithTransaction(transaction, actorId, deletedImage.id, actorId);
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
      classRO: UserImageDeleteRO,
      response,
      message: 'Delete user image successfully',
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
