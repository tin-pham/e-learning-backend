import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonAttachmentRepository } from './lesson-attachment.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonAttachmentBulkDeleteDTO, LessonAttachmentBulkStoreDTO, LessonAttachmentGetListDTO } from './dto/lesson-attachment.dto';
import { ResultRO } from '../common/ro/result.ro';
import { LessonAttachmentGetListRO } from './ro/lesson-attachment.ro';
import { LessonAttachmentEntity } from './lesson-attachment.entity';

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
      const { files, lessonId } = dto;

      const entities = files.map(
        (file) =>
          new LessonAttachmentEntity({
            url: file.url,
            name: file.name,
            type: file.type,
            size: file.size,
            lessonId,
            createdBy: actorId,
          }),
      );

      await this.lessonAttachmentRepository.insertMultiple(entities);
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

  async getList(dto: LessonAttachmentGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.lessonAttachmentRepository.findByLessonId(dto.lessonId);
      return this.success({
        classRO: LessonAttachmentGetListRO,
        response: { data: response },
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.LESSON_ATTACHMENT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
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
