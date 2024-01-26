import { Injectable, Logger } from '@nestjs/common';
import { EXCEPTION, IJwtPayload } from '../common';
import { BaseService } from '../base';
import { SubmitOptionStoreDTO, SubmitOptionUpdateDTO } from './dto/submit-option.dto';
import { QuestionRepository } from '../question/question.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { SubmitOptionRepository } from './submit-option.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { SubmitOptionEntity } from './submit-option.entity';
import { SubmitOptionStoreRO, SubmitOptionUpdateRO } from './ro/submit-option.ro';

@Injectable()
export class SubmitOptionService extends BaseService {
  private readonly logger = new Logger(SubmitOptionService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly questionRepository: QuestionRepository,
    private readonly questionOptionRepository: QuestionOptionRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly submitOptionRepository: SubmitOptionRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: SubmitOptionStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    let response: SubmitOptionStoreRO;

    try {
      const submitOptionData = new SubmitOptionEntity({
        questionId: dto.questionId,
        questionOptionId: dto.questionOptionId,
        exerciseId: dto.exerciseId,
      });

      const submitOption = await this.submitOptionRepository.insert(submitOptionData);

      response = new SubmitOptionStoreRO({
        id: submitOption.id,
        questionId: submitOption.questionId,
        questionOptionId: submitOption.questionOptionId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.SUBMIT_OPTION.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: SubmitOptionStoreRO,
      response,
      message: 'Successfully store submit option',
      actorId,
    });
  }

  async update(id: number, dto: SubmitOptionUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    let response: SubmitOptionUpdateRO;

    try {
      const submitOptionData = new SubmitOptionEntity();
      submitOptionData.questionOptionId = dto.questionOptionId;
      submitOptionData.updatedAt = new Date();
      submitOptionData.updatedBy = actorId;

      const submitOption = await this.submitOptionRepository.update(id, submitOptionData);

      response = new SubmitOptionUpdateRO({
        id: submitOption.id,
        questionOptionId: submitOption.questionOptionId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.SUBMIT_OPTION.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: SubmitOptionUpdateRO,
      response,
      message: 'Successfully update submit option',
      actorId,
    });
  }

  private async validateStore(dto: SubmitOptionStoreDTO, actorId: number) {
    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countById(dto.questionId);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question exist
    const questionCount = await this.questionRepository.countById(dto.questionId);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check questionOption exist
    const questionOption = await this.questionOptionRepository.getQuestionIdById(dto.questionOptionId);
    if (!questionOption) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check questionOption belong to question
    if (questionOption.questionId !== dto.questionId) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_BELONG_TO_QUESTION;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: SubmitOptionUpdateDTO, actorId: number) {
    // Check submit option exist
    const submitOption = await this.submitOptionRepository.getQuestionIdById(id);
    if (!submitOption) {
      const { code, status, message } = EXCEPTION.SUBMIT_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check questionOption exist
    const questionOption = await this.questionOptionRepository.getQuestionIdById(dto.questionOptionId);
    if (!questionOption) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check questionOption belong to question submitted
    if (questionOption.questionId !== submitOption.questionId) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_BELONG_TO_QUESTION;
      this.throwException({ code, status, message, actorId });
    }
  }
}
