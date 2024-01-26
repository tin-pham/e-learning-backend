import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { QuestionOptionEntity } from './question-option.entity';
import { QuestionOptionRepository } from './question-option.repository';
import { QuestionRepository } from '../question/question.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { QuestionOptionGetListDTO, QuestionOptionStoreDTO, QuestionOptionUpdateDTO } from './dto/question-option.dto';
import {
  QuestionOptionDeleteRO,
  QuestionOptionGetDetailRO,
  QuestionOptionGetListRO,
  QuestionOptionStoreRO,
  QuestionOptionUpdateRO,
} from './ro/question-option.ro';

@Injectable()
export class QuestionOptionService extends BaseService {
  private readonly logger = new Logger(QuestionOptionService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly questionOptionRepository: QuestionOptionRepository,
    private readonly questionRepository: QuestionRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: QuestionOptionStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new QuestionOptionStoreRO();

    try {
      const questionOptionData = new QuestionOptionEntity();
      questionOptionData.text = dto.text;
      questionOptionData.questionId = dto.questionId;
      questionOptionData.isCorrect = dto.isCorrect;
      questionOptionData.createdBy = actorId;

      const questionOption = await this.questionOptionRepository.insert(questionOptionData);

      response.id = questionOption.id;
      response.text = questionOption.text;
      response.isCorrect = questionOption.isCorrect;
      response.questionId = questionOption.questionId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: QuestionOptionStoreRO,
      response,
      message: 'Store question option successfully',
      actorId,
    });
  }

  async getList(dto: QuestionOptionGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.questionOptionRepository.find(dto);

      return this.success({
        classRO: QuestionOptionGetListRO,
        response,
        message: 'Get list question option successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let questionOption: QuestionOptionEntity;

    try {
      questionOption = await this.questionOptionRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!questionOption) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    const response = new QuestionOptionGetDetailRO();
    response.id = questionOption.id;
    response.text = questionOption.text;
    response.isCorrect = questionOption.isCorrect;
    response.questionId = questionOption.questionId;

    return this.success({
      classRO: QuestionOptionGetDetailRO,
      response,
      message: 'Get question option detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: QuestionOptionUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new QuestionOptionUpdateRO();
    try {
      const questionOptionData = new QuestionOptionEntity();
      questionOptionData.updatedBy = actorId;
      questionOptionData.updatedAt = new Date();
      if (dto.text) {
        questionOptionData.text = dto.text;
      }

      const questionOption = await this.questionOptionRepository.update(id, questionOptionData);

      response.id = questionOption.id;
      response.text = questionOption.text;
      response.questionId = questionOption.questionId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: QuestionOptionUpdateRO,
      response,
      message: 'Update question option successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new QuestionOptionDeleteRO();

    try {
      const questionOption = await this.questionOptionRepository.delete(id, actorId);

      response.id = questionOption.id;
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: QuestionOptionDeleteRO,
      response,
      message: 'Delete question option successfully',
      actorId,
    });
  }

  private async validateStore(dto: QuestionOptionStoreDTO, actorId: number) {
    // Check question exist
    const questionCount = await this.questionRepository.countById(dto.questionId);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check duplicate isCorrect
    if (dto.isCorrect) {
      const questionOptionCount = await this.questionOptionRepository.countByQuestionIdAndCorrect(dto.questionId);
      if (questionOptionCount) {
        const { code, status, message } = EXCEPTION.QUESTION_OPTION.IS_CORRECT_ALREADY_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    // Check text unique in same question
    const questionOptionCount = await this.questionOptionRepository.countByQuestionIdAndText(dto.questionId, dto.text);
    if (questionOptionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: QuestionOptionUpdateDTO, actorId: number) {
    // Check exist
    const questionOption = await this.questionOptionRepository.findOneById(id);
    if (!questionOption) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check text unique in same question except current id
    const questionOptionCount = await this.questionOptionRepository.countByQuestionIdAndTextExceptId(
      questionOption.questionId,
      dto.text,
      id,
    );
    if (questionOptionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const questionCount = await this.questionOptionRepository.countById(id);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
