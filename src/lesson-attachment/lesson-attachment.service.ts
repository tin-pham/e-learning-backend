import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonAttachmentEntity } from './lesson-attachment.entity';
import { LessonRepository } from '../lesson/lesson.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { LessonAttachmentRepository } from './lesson-attachment.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonAttachmentBulkDeleteDTO, LessonAttachmentBulkStoreDTO } from './dto/lesson-attachment.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class LessonAttachmentService extends BaseService {
  private readonly logger = new Logger(LessonAttachmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly lessonRepository: LessonRepository,
    private readonly attachmentRepository: AttachmentRepository,
    private readonly lessonAttachmentRepository: LessonAttachmentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: LessonAttachmentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const lessonAttachmentData = dto.lessonIds.flatMap((lessonId) =>
        dto.attachmentIds.map((attachmentId) => new LessonAttachmentEntity({ lessonId, attachmentId: attachmentId, createdBy: actorId })),
      );

      await this.lessonAttachmentRepository.insertMultiple(lessonAttachmentData);
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
    const { lessonIds, attachmentIds } = dto;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.lessonAttachmentRepository.deleteMultipleByLessonIdsAndAttachmentIds(lessonIds, attachmentIds, actorId);
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

  private async validateBulkStore(dto: LessonAttachmentBulkStoreDTO, actorId: number) {
    // check lesson exists
    const lessonCount = await this.lessonRepository.countByIds(dto.lessonIds);
    if (lessonCount !== dto.lessonIds.length) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // check attachment exists
    const attachmentCount = await this.attachmentRepository.countByIds(dto.attachmentIds);
    if (attachmentCount !== dto.attachmentIds.length) {
      const { status, message, code } = EXCEPTION.FILE.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // check lesson attachhment exist
    const lessonAttachmentCount = await this.lessonAttachmentRepository.countByLessonIdsAndAttachmentIds(dto.lessonIds, dto.attachmentIds);
    if (lessonAttachmentCount > 0) {
      const { status, message, code } = EXCEPTION.LESSON_ATTACHMENT.ALREADY_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateBulkDelete(dto: LessonAttachmentBulkDeleteDTO, actorId: number) {
    // check lesson exists
    const lessonCount = await this.lessonRepository.countByIds(dto.lessonIds);
    if (lessonCount !== dto.lessonIds.length) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // check attachment exists
    const attachmentCount = await this.attachmentRepository.countByIds(dto.attachmentIds);
    if (attachmentCount !== dto.attachmentIds.length) {
      const { status, message, code } = EXCEPTION.ATTACHMENT.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
