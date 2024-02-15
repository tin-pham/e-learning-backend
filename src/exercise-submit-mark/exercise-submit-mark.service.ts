import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ExerciseSubmitMarkRepository } from './exercise-submit-mark.repository';
import { ExerciseSubmitRepository } from '../exercise-submit/exercise-submit.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { QuestionRepository } from '../question/question.repository';
import { ExerciseSubmitOptionRepository } from '../exercise-submit-option/exercise-submit-option.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseSubmitMarkCalculateDTO } from './dto/exercise-submit-mark.dto';
import { ExerciseSubmitMarkEntity } from './exercise-submit-mark.entity';
import { ExerciseSubmitMarkCalculateRO, ExerciseSubmitMarkDeleteRO } from './ro/exercise-submit-mark.ro';

@Injectable()
export class ExerciseSubmitMarkService extends BaseService {
  private readonly logger = new Logger(ExerciseSubmitMarkService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly exerciseSubmitMarkRepository: ExerciseSubmitMarkRepository,
    private readonly exerciseSubmitRepository: ExerciseSubmitRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly questionOptionRepository: QuestionOptionRepository,
    private readonly exerciseSubmitOptionRepository: ExerciseSubmitOptionRepository,
  ) {
    super(elasticLogger);
  }

  async calculate(dto: ExerciseSubmitMarkCalculateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { exerciseSubmit } = await this.validateCalculate(dto, actorId);
    let response: ExerciseSubmitMarkCalculateRO;

    try {
      const exerciseSubmitMarkData = new ExerciseSubmitMarkEntity();
      exerciseSubmitMarkData.correctCount = 0;
      exerciseSubmitMarkData.exerciseSubmitId = exerciseSubmit.id;

      // Get question ids by exercise id
      const questions = await this.questionRepository.getIdsByExerciseId(exerciseSubmit.exerciseId);
      const questionIds = questions.map((question) => question.id);

      exerciseSubmitMarkData.totalCount = questionIds.length;

      for (const questionId of questionIds) {
        // Get correct question option
        const correctQuestionOptions = await this.questionOptionRepository.getCorrectIdByQuestionId(questionId);
        const correctQuestionOptionIds = correctQuestionOptions.map((option) => option.id);

        // Get exercise submit option
        const exerciseSubmitOptions = await this.exerciseSubmitOptionRepository.getQuestionOptionByExerciseSubmitIdAndQuestionId(
          exerciseSubmit.id,
          questionId,
        );
        const exerciseSubmitOptionQuestionOptionIds = exerciseSubmitOptions.map((option) => option.questionOptionId);

        // Compare
        if (correctQuestionOptionIds.every((optionId) => exerciseSubmitOptionQuestionOptionIds.includes(optionId))) {
          exerciseSubmitMarkData.correctCount += 1;
        }
      }

      exerciseSubmitMarkData.point = (exerciseSubmitMarkData.correctCount / exerciseSubmitMarkData.totalCount) * dto.basePoint;

      const exerciseSubmitMark = await this.exerciseSubmitMarkRepository.insert(exerciseSubmitMarkData);

      response = new ExerciseSubmitMarkCalculateRO({
        id: exerciseSubmitMark.id,
        point: exerciseSubmitMark.point,
        correctCount: exerciseSubmitMark.correctCount,
        totalCount: exerciseSubmitMark.totalCount,
        exerciseSubmitId: exerciseSubmitMark.exerciseSubmitId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT_MARK.CALCULATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseSubmitMarkCalculateRO,
      response,
      message: 'Calculate success',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    let response: ExerciseSubmitMarkDeleteRO;

    try {
      const exerciseSubmit = await this.exerciseSubmitMarkRepository.deleteById(id, actorId);

      response = new ExerciseSubmitMarkDeleteRO({
        id: exerciseSubmit.id,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT_MARK.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseSubmitMarkDeleteRO,
      response,
      message: 'Exercise submit mark deleted successfully',
      actorId,
    });
  }

  private async validateCalculate(dto: ExerciseSubmitMarkCalculateDTO, actorId: number) {
    // Check unique
    const exerciseSubmitMarkCount = await this.exerciseSubmitMarkRepository.countByExerciseSubmitId(dto.exerciseSubmitId);
    if (exerciseSubmitMarkCount) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT_MARK.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check exercise submit exist
    const exerciseSubmit = await this.exerciseSubmitRepository.findOneById(dto.exerciseSubmitId);
    if (!exerciseSubmit) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return { exerciseSubmit };
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const exerciseSubmitMarkCount = await this.exerciseSubmitMarkRepository.countById(id);
    if (!exerciseSubmitMarkCount) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT_MARK.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
