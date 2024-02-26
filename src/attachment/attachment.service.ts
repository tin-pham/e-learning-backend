import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { AttachmentRepository } from './attachment.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AttachmentEntity } from './attachment.entity';
import {
  AttachmentBulkDeleteDTO,
  AttachmentBulkStoreDTO,
  AttachmentGetDetailDTO,
  AttachmentGetListDTO,
  AttachmentStoreDTO,
} from './dto/attachment.dto';
import { ResultRO } from '../common/ro/result.ro';
import { AttachmentGetListRO, AttachmentStoreRO } from './ro/attachment.ro';

@Injectable()
export class AttachmentService extends BaseService {
  private readonly logger = new Logger(AttachmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly attachmentRepository: AttachmentRepository,
  ) {
    super(elasticLogger);
  }

  async getDetail(dto: AttachmentGetDetailDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateGetDetail(dto, actorId);

    let attachment;

    try {
      attachment = await this.attachmentRepository.findOneByAssignmentIdAndCreatedById(dto.assignmentId, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!attachment) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AttachmentGetListRO,
      response: attachment,
    });
  }

  async store(dto: AttachmentStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const response = new AttachmentStoreRO();

    try {
      const entity = new AttachmentEntity({
        url: dto.url,
        name: dto.name,
        type: dto.type,
        size: dto.size,
        createdBy: actorId,
        lessonId: dto.lessonId,
        assignmentId: dto.assignmentId,
      });

      const attachment = await this.attachmentRepository.insert(entity);
      console.log(attachment);

      response.id = attachment.id;
      response.url = attachment.url;
      response.name = attachment.name;
      response.type = attachment.type;
      response.size = attachment.size;
      response.createdBy = attachment.createdBy;
      response.lessonId = attachment.lessonId;
      response.createdAt = attachment.createdAt;
    } catch (error) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AttachmentStoreRO,
      response,
      message: 'Store file successfully',
      actorId,
    });
  }

  async bulkStore(dto: AttachmentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const { files, lessonId, assignmentId } = dto;

      const entities = files.map(
        (file) =>
          new AttachmentEntity({
            url: file.url,
            name: file.name,
            type: file.type,
            size: file.size,
            lessonId,
            assignmentId,
            createdBy: actorId,
          }),
      );

      await this.attachmentRepository.insertMultiple(entities);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Store file successfully',
      actorId,
    });
  }

  async bulkDelete(dto: AttachmentBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.attachmentRepository.deleteMultipleByIds(dto.ids, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Delete file successfully',
      actorId,
    });
  }

  async getList(dto: AttachmentGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.attachmentRepository.find(dto);
      return this.success({
        classRO: AttachmentGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(dto: AttachmentBulkDeleteDTO, actorId: number) {
    // Check exist
    const attachmentCount = await this.attachmentRepository.countByIds(dto.ids);
    if (attachmentCount !== dto.ids.length) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateGetDetail(dto: AttachmentGetDetailDTO, actorId: number) {
    // Check exist
    const attachmentCount = await this.attachmentRepository.countByAssignmentIdAndCreatedById(dto.assignmentId, actorId);
    if (!attachmentCount) {
      const { code, status, message } = EXCEPTION.ATTACHMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
