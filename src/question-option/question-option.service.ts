import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { QuestionOptionEntity } from './question-option.entity';
import { QuestionOptionRepository } from './question-option.repository';
import { QuestionRepository } from '../question/question.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { QuestionOptionGetListDTO, QuestionOptionStoreDTO, QuestionOptionBulkUpdateDTO } from './dto/question-option.dto';
import { QuestionOptionDeleteRO, QuestionOptionGetDetailRO, QuestionOptionGetListRO, QuestionOptionStoreRO } from './ro/question-option.ro';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class QuestionOptionService extends BaseService {
  private readonly logger = new Logger(QuestionOptionService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
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

  async bulkUpdate(dto: QuestionOptionBulkUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkUpdate(dto, actorId);

    try {
      for (const data of dto.data) {
        const option = new QuestionOptionEntity();
        option.id = data.id;
        option.text = data.dto.text;
        option.isCorrect = data.dto.isCorrect;

        await this.database.transaction().execute(async (transaction) => {
          await this.questionOptionRepository.updateWithTransaction(transaction, option.id, option);
        });
      }
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.BULK_UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Bulk update question option successfully',
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

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const questionCount = await this.questionOptionRepository.countById(id);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkUpdate(dto: QuestionOptionBulkUpdateDTO, actorId: number) {
    // Check exist
    const ids = dto.data.map((data) => data.id);
    const questionCount = await this.questionOptionRepository.countByIds(ids);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check text duplicate
    const texts = dto.data.map((data) => data.dto.text);
    if (texts.length !== new Set(texts).size) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.TEXT_DUPLICATE;
      this.throwException({ code, status, message, actorId });
    }

    //  It should contain both true and false
    const isCorrects = dto.data.map((option) => option.dto.isCorrect);
    const allTrue = isCorrects.every((value) => value === true);
    const allFalse = isCorrects.every((value) => value === false);

    if (allTrue || allFalse) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.IS_CORRECT_DIVERSITY_REQUIRED;
      this.throwException({ code, status, message, actorId });
    }

    // It should adjust isMultipleChoice
    const trueCount = isCorrects.filter((value) => value === true).length;
    let isMultipleChoice = false;
    if (trueCount > 1) {
      isMultipleChoice = true;
    }

    return { ids, isMultipleChoice };
  }
}
