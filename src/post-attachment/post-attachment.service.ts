import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { S3Service } from '../s3/s3.service';
import { PostAttachmentRepository } from './post-attachment.repository';
import { PostRepository } from '../post/post.repository';
import { AttachmentEntity } from '../attachment/attachment.entity';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { PostAttachmentBulkDeleteDTO, PostAttachmentBulkStoreDTO } from './dto/post-attachment.dto';
import { PostAttachmentEntity } from './post-attachment.entity';
import { ResultRO } from 'src/common/ro/result.ro';

@Injectable()
export class PostAttachmentService extends BaseService {
  private readonly logger = new Logger(PostAttachmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly s3Service: S3Service,
    private readonly postRepository: PostRepository,
    private readonly postAttachmentRepository: PostAttachmentRepository,
    private readonly attachmentRepository: AttachmentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: PostAttachmentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        const s3Response = await this.s3Service.bulkUpload({ files: dto.files, directoryPath: 'post-attachment' }, decoded);

        const attachmentData = s3Response.data.map((attachment) => {
          const data = new AttachmentEntity();
          data.url = attachment.url;
          data.name = attachment.name;
          data.size = attachment.size;
          data.type = attachment.type;
          return data;
        });

        const attachments = await this.attachmentRepository.insertMultipleWithTransaction(transaction, attachmentData);
        const attachmentIds = attachments.map((attachment) => attachment.id);
        const postAttachmentData = attachmentIds.map((attachmentId) => {
          const data = new PostAttachmentEntity();
          data.postId = dto.postId;
          data.attachmentId = attachmentId;
          return data;
        });
        await this.postAttachmentRepository.insertMultipleWithTransaction(transaction, postAttachmentData);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.POST_ATTACHMENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Post attachment bulk store successfully',
      actorId,
    });
  }

  async bulkDelete(dto: PostAttachmentBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        await this.postAttachmentRepository.deleteMultipleByAttachmentIdsWithTransaction(transaction, dto.attachmentIds, actorId);
        const attachments = await this.attachmentRepository.deleteMultipleWithTransaction(transaction, dto.attachmentIds, actorId);
        const urls = attachments.map((attachment) => attachment.url);
        await this.s3Service.bulkDelete({ urls }, decoded);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.POST_ATTACHMENT.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkStore(dto: PostAttachmentBulkStoreDTO, actorId: number) {
    // Check post exist
    const postCount = await this.postRepository.countById(dto.postId);
    if (!postCount) {
      const { code, status, message } = EXCEPTION.POST.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(dto: PostAttachmentBulkDeleteDTO, actorId: number) {
    // Check posts exist
    const attachmentCount = await this.attachmentRepository.countByIds(dto.attachmentIds);
    if (!attachmentCount) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
