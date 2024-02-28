import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { AttachmentEntity } from '../attachment/attachment.entity';
import { S3Service } from '../s3/s3.service';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { AssignmentAttachmentRepository } from './assignment-attachment.repository';
import { AssignmentAttachmentBulkStoreDTO } from './dto/assignment-attachment.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class AssignmentAttachmentService extends BaseService {
  private readonly logger = new Logger(AssignmentAttachmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly s3Service: S3Service,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly attachmentRepository: AttachmentRepository,
    private readonly assignmentAttachmentRepository: AssignmentAttachmentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: AssignmentAttachmentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store to s3
        const s3Response = await this.s3Service.bulkUpload({ files: dto.files, directoryPath: 'assignment' }, decoded);

        // Store attachment
        const attachmentData = s3Response.data.map(
          (file) =>
            new AttachmentEntity({
              url: file.url,
              name: file.name,
              type: file.type,
              size: file.size,
              createdBy: actorId,
            }),
        );
        const attachments = await this.attachmentRepository.insertMultipleWithTransaction(transaction, attachmentData);

        // Store assignment attachment
        const assignmentAttachments = attachments.map((attachment) => ({ attachmentId: attachment.id, assignmentId: dto.assignmentId }));
        await this.assignmentAttachmentRepository.insertMultipleWithTransaction(transaction, assignmentAttachments);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_ATTACHMENT.BULK_STORE_FAILED;
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

  private async validateBulkStore(dto: AssignmentAttachmentBulkStoreDTO, actorId: number) {
    // Check assignment exist
    const assignmentCount = await this.assignmentRepository.countById(dto.assignmentId);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
