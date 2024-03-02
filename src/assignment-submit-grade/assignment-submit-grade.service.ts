import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { ElasticsearchLoggerService } from 'src/elastic-search-logger/elastic-search-logger.service';
import { AssignmentSubmitGradeStoreDTO } from './dto/assignment-submit-grade.dto';
import { AssignmentSubmitRepository } from 'src/assignment-submit/assignment-submit.repository';
import { EXCEPTION, IJwtPayload } from 'src/common';
import { AssignmentSubmitGradeEntity } from './assignment-submit-grade.entity';
import { AssignmentSubmitGradeRepository } from './assignment-submit-grade.repository';
import { AssignmentSubmitGradeStoreRO } from './ro/assignment-submit-grade.ro';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class AssignmentSubmitGradeService extends BaseService {
  private readonly logger = new Logger(AssignmentSubmitGradeService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly assignmentSubmitRepository: AssignmentSubmitRepository,
    private readonly assignmentSubmitGradeRepository: AssignmentSubmitGradeRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: AssignmentSubmitGradeStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new AssignmentSubmitGradeStoreRO();

    try {
      const assignmentSubmitGradeData = new AssignmentSubmitGradeEntity({
        assignmentSubmitId: dto.assignmentSubmitId,
        message: dto.message,
        grade: dto.grade,
        createdBy: actorId,
      });

      const assignmentSubmitGrade = await this.assignmentSubmitGradeRepository.insert(assignmentSubmitGradeData);

      response.id = assignmentSubmitGrade.id;
      response.grade = assignmentSubmitGrade.grade;
      response.message = assignmentSubmitGrade.message;
      response.assignmentSubmitId = assignmentSubmitGrade.assignmentSubmitId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT_GRADE.STORE_FAILED;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentSubmitGradeStoreRO,
      response,
      message: 'Store assignment submit grade successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      await this.assignmentSubmitGradeRepository.delete(id, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT_GRADE.DELETE_FAILED;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Delete assignment submit grade successfully',
      actorId,
    });
  }

  private async validateStore(dto: AssignmentSubmitGradeStoreDTO, actorId: number) {
    // Check assignment submit exist
    const assignmentSubmitCount = await this.assignmentSubmitRepository.countById(dto.assignmentSubmitId);
    if (!assignmentSubmitCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT.DOES_NOT_EXIST;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }

    // Check exist
    const assignmentSubmitGradeCount = await this.assignmentSubmitGradeRepository.countByAssignmentSubmitId(dto.assignmentSubmitId);
    if (assignmentSubmitGradeCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT_GRADE.ALREADY_EXIST;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const assignmentSubmitGradeCount = await this.assignmentSubmitGradeRepository.countById(id);
    if (!assignmentSubmitGradeCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT_GRADE.DOES_NOT_EXIST;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }
  }
}
