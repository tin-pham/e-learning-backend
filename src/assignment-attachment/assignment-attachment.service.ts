import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { AssignmentAttachmentRepository } from './assignment-attachment.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AssignmentAttachmentBulkStoreDTO } from './dto/assignment-attachment.dto';
import { ResultRO } from 'src/common/ro/result.ro';

@Injectable()
export class AssignmentAttachmentService extends BaseService {
  private readonly logger = new Logger(AssignmentAttachmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentAttachmentRepository: AssignmentAttachmentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: AssignmentAttachmentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      await this.assignmentAttachmentRepository.insertMultiple(dto, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_ATTACHMENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Assignment attachment bulk store successfully',
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
