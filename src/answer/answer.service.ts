import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { AnswerEntity } from './answer.entity';
import { AnswerRepository } from './answer.repository';
import { QuestionRepository } from '../question/question.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AnswerStoreDTO, AnswerUpdateDTO } from './dto/answer.dto';
import { AnswerDeleteRO, AnswerGetDetailRO, AnswerStoreRO, AnswerUpdateRO } from './ro/answer.ro';

@Injectable()
export class AnswerService extends BaseService {
  private readonly logger = new Logger(AnswerService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly answerRepository: AnswerRepository,
    private readonly questionRepository: QuestionRepository,
    private readonly questionOptionRepository: QuestionOptionRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: AnswerStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new AnswerStoreRO();

    try {
      const answerData = new AnswerEntity();
      answerData.questionId = dto.questionId;
      answerData.questionOptionId = dto.questionOptionId;
      answerData.creatorId = actorId;

      const answer = await this.answerRepository.insert(answerData);

      response.id = answer.id;
      response.questionId = answer.questionId;
      response.questionOptionId = answer.questionOptionId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.ANSWER.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AnswerStoreRO,
      response,
      message: 'Store answer successfully',
      actorId,
    });
  }

  async getDetailByQuestionId(questionId: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    const response = new AnswerGetDetailRO();

    try {
      const answer = await this.answerRepository.findOneByQuestionId(questionId);
      if (!answer) {
        const { code, status, message } = EXCEPTION.ANSWER.NOT_FOUND;
        this.throwException({ code, status, message, actorId });
      }

      response.id = answer.id;
      response.questionId = answer.questionId;
      response.questionOptionId = answer.questionOptionId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.ANSWER.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AnswerGetDetailRO,
      response,
      message: 'Get answerr detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: AnswerUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new AnswerUpdateRO();

    try {
      const answerData = new AnswerEntity();
      answerData.updatedBy = actorId;
      answerData.updatedAt = new Date();
      if (dto.questionOptionId) {
        answerData.questionOptionId = dto.questionOptionId;
      }

      const answer = await this.answerRepository.update(id, answerData);

      response.id = answer.id;
      response.questionOptionId = answer.questionOptionId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.ANSWER.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AnswerUpdateRO,
      response,
      message: 'Update answer successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new AnswerDeleteRO();

    try {
      const answer = await this.answerRepository.delete(id, actorId);

      response.id = answer.id;
    } catch (error) {
      const { code, status, message } = EXCEPTION.ANSWER.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AnswerDeleteRO,
      response,
      message: 'Delete answer successfully',
      actorId,
    });
  }

  private async validateStore(dto: AnswerStoreDTO, actorId: number) {
    //  Check question exist
    const questionCount = await this.questionRepository.countById(dto.questionId);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question option exist
    const questionOptionCount = await this.questionRepository.countById(dto.questionOptionId);
    if (!questionOptionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question option belong to question
    const questionOption = await this.questionOptionRepository.getQuestionIdById(dto.questionId);
    if (questionOption.questionId !== dto.questionOptionId) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_BELONG_TO_QUESTION;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: AnswerUpdateDTO, actorId: number) {
    // Check exist
    const answerCount = await this.answerRepository.countById(id);
    if (!answerCount) {
      const { code, status, message } = EXCEPTION.ANSWER.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question option exist
    const questionOptionCount = await this.questionRepository.countById(dto.questionOptionId);
    if (!questionOptionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question option belong to question
    const questionOption = await this.questionOptionRepository.getQuestionIdById(dto.questionOptionId);
    if (questionOption.questionId !== dto.questionOptionId) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_BELONG_TO_QUESTION;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const answerCount = await this.answerRepository.countById(id);
    if (!answerCount) {
      const { code, status, message } = EXCEPTION.ANSWER.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
