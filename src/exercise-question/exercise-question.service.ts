import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ExerciseQuestionEntity } from './exercise-question.entity';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { QuestionRepository } from '../question/question.repository';
import { ExerciseQuestionRepository } from './exercise-question.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseQuestionBulkDeleteDTO, ExerciseQuestionBulkStoreDTO } from './dto/exercise-question.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class ExerciseQuestionService extends BaseService {
  private readonly logger = new Logger(ExerciseQuestionService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly exerciseQuestionRepository: ExerciseQuestionRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: ExerciseQuestionBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const exerciseQuestionData = dto.exerciseIds.flatMap((exerciseId) =>
        dto.questionIds.map((questionId) => new ExerciseQuestionEntity({ exerciseId, questionId, createdBy: actorId })),
      );

      await this.exerciseQuestionRepository.insertMultiple(exerciseQuestionData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Exercise question created successfully',
      actorId,
    });
  }

  async bulkDelete(dto: ExerciseQuestionBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.exerciseQuestionRepository.deleteMultipleByExerciseIdsAndQuestionIds(dto.exerciseIds, dto.questionIds, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Exercise question deleted successfully',
      actorId,
    });
  }

  private async validateBulkStore(dto: ExerciseQuestionBulkStoreDTO, actorId: number) {
    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countByIds(dto.exerciseIds);
    if (exerciseCount !== dto.exerciseIds.length) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question exist
    const questionCount = await this.questionRepository.countByIds(dto.questionIds);
    if (questionCount !== dto.questionIds.length) {
      const { code, status, message } = EXCEPTION.QUESTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check exercise question exist
    const exerciseQuestionCount = await this.exerciseQuestionRepository.countByExerciseIdsAndQuestionIds(dto.exerciseIds, dto.questionIds);
    if (exerciseQuestionCount > 0) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(dto: ExerciseQuestionBulkDeleteDTO, actorId: number) {
    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countByIds(dto.exerciseIds);
    if (exerciseCount !== dto.exerciseIds.length) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question exist
    const questionCount = await this.questionRepository.countByIds(dto.questionIds);
    if (questionCount !== dto.questionIds.length) {
      const { code, status, message } = EXCEPTION.QUESTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
