import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ExerciseSubmitOptionRepository } from './exercise-submit-option.repository';
import { QuestionRepository } from '../question/question.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { ExerciseSubmitRepository } from '../exercise-submit/exercise-submit.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseSubmitOptionInsertDTO } from './dto/exercise-submit-option.dto';
import { ExerciseSubmitOptionEntity } from './exercise-submit-option.entity';
import { ExerciseSubmitOptionInsertRO } from './ro/exercise-submit-option.ro';

@Injectable()
export class ExerciseSubmitOptionService extends BaseService {
  private readonly logger = new Logger(ExerciseSubmitOptionService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly questionRepository: QuestionRepository,
    private readonly questionOptionRepository: QuestionOptionRepository,
    private readonly exerciseSubmitRepository: ExerciseSubmitRepository,
    private readonly exerciseSubmitOptionRepository: ExerciseSubmitOptionRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: ExerciseSubmitOptionInsertDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateInsert(dto, actorId);

    let response: ExerciseSubmitOptionInsertRO;

    try {
      const exerciseSubmitOptionData = new ExerciseSubmitOptionEntity({
        questionId: dto.questionId,
        questionOptionId: dto.questionOptionId,
        exerciseSubmitId: dto.exerciseSubmitId,
      });
      const exerciseSubmitOption = await this.exerciseSubmitOptionRepository.insert(exerciseSubmitOptionData);

      response = new ExerciseSubmitOptionInsertRO({
        id: exerciseSubmitOption.id,
        questionId: exerciseSubmitOption.questionId,
        questionOptionId: exerciseSubmitOption.questionOptionId,
        exerciseSubmitId: exerciseSubmitOption.exerciseSubmitId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT_OPTION.INSERT_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseSubmitOptionInsertRO,
      response,
      message: 'Exercise submit option created successfully',
      actorId,
    });
  }

  private async validateInsert(dto: ExerciseSubmitOptionInsertDTO, actorId: number) {
    // Check exercise submit exist
    const exerciseSubmit = await this.exerciseSubmitRepository.findOneById(dto.exerciseSubmitId);
    if (!exerciseSubmit) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question exist
    const questionCount = await this.questionRepository.countById(dto.questionId);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question option exist
    const questionOptionCount = await this.questionOptionRepository.countById(dto.questionOptionId);
    if (!questionOptionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
