import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonAttachmentRepository } from './lesson-attachment.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonAttachmentBulkDeleteDTO, LessonAttachmentBulkStoreDTO } from './dto/lesson-attachment.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class LessonAttachmentService extends BaseService {
  private readonly logger = new Logger(LessonAttachmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly lessonAttachmentRepository: LessonAttachmentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: LessonAttachmentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      await this.lessonAttachmentRepository.insertMultiple(dto, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.LESSON_ATTACHMENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Store lesson file successfully',
      actorId,
    });
  }

  async bulkDelete(dto: LessonAttachmentBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.lessonAttachmentRepository.deleteMultipleByIds(dto.ids, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.LESSON_ATTACHMENT.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Delete lesson file successfully',
      actorId,
    });
  }

  private async validateBulkDelete(dto: LessonAttachmentBulkDeleteDTO, actorId: number) {
    // Check exist
    const lessonAttachmentCount = await this.lessonAttachmentRepository.countByIds(dto.ids);
    if (lessonAttachmentCount !== dto.ids.length) {
      const { code, status, message } = EXCEPTION.LESSON_ATTACHMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
