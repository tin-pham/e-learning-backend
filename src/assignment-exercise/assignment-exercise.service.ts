import { Injectable } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { AssignmentExerciseRepository } from './assignment-exercise.repository';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AssignmentExerciseDeleteDTO, AssignmentExerciseStoreDTO } from './dto/assignment-exercise.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class AssignmentExerciseService extends BaseService {
  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly assignmentExerciseRepository: AssignmentExerciseRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: AssignmentExerciseStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      await this.assignmentExerciseRepository.insertMulitpleByAssignmentIdsAndExerciseIds(dto.assignmentIds, dto.exerciseIds, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_EXERCISE.BULK_STORE_FAILED;
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Successfully store assignment exercise',
      actorId,
    });
  }

  async bulkDelete(dto: AssignmentExerciseDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.assignmentExerciseRepository.deleteMultipleByAssignmentIdsAndExerciseIds(dto.assignmentIds, dto.exerciseIds, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_EXERCISE.BULK_DELETE_FAILED;
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Successfully delete assignment exercise',
      actorId,
    });
  }

  private async validateBulkStore(dto: AssignmentExerciseStoreDTO, actorId: number) {
    // Check assignment exist
    const assignmentCount = await this.assignmentRepository.countByIds(dto.assignmentIds);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countByIds(dto.exerciseIds);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check unique
    const assignmentExerciseCount = await this.assignmentExerciseRepository.countByAssignmentIdsAndExerciseIds(
      dto.assignmentIds,
      dto.exerciseIds,
    );
    if (assignmentExerciseCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_EXERCISE.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(dto: AssignmentExerciseDeleteDTO, actorId: number) {
    // Check assignment exist
    const assignmentCount = await this.assignmentRepository.countByIds(dto.assignmentIds);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countByIds(dto.exerciseIds);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
