import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { QuestionEntity } from './question.entity';
import { QuestionRepository } from './question.repository';
import { DifficultyRepository } from '../difficulty/difficulty.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { QuestionGetListDTO, QuestionStoreDTO, QuestionUpdateDTO } from './dto/question.dto';
import { QuestionDeleteRO, QuestionGetDetailRO, QuestionGetListRO, QuestionStoreRO, QuestionUpdateRO } from './ro/question.ro';

@Injectable()
export class QuestionService extends BaseService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly questionRepository: QuestionRepository,
    private readonly difficultyRepository: DifficultyRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: QuestionStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new QuestionStoreRO();

    try {
      const questionData = new QuestionEntity();
      questionData.text = dto.text;
      questionData.difficultyId = dto.difficultyId;
      questionData.isMultipleChoice = dto.isMultipleChoice;
      questionData.createdBy = actorId;

      const question = await this.questionRepository.insert(questionData);

      response.id = question.id;
      response.text = question.text;
      response.difficultyId = question.difficultyId;
      response.isMultipleChoice = question.isMultipleChoice;
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: QuestionStoreRO,
      response,
      message: 'Store question successfully',
      actorId,
    });
  }

  async getList(dto: QuestionGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.questionRepository.find(dto);

      return this.success({
        classRO: QuestionGetListRO,
        response,
        message: 'Get list question successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let question: QuestionEntity;

    try {
      question = await this.questionRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!question) {
      const { code, status, message } = EXCEPTION.QUESTION.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    const response = new QuestionGetDetailRO();
    response.id = question.id;
    response.text = question.text;
    response.difficultyId = question.difficultyId;
    response.isMultipleChoice = question.isMultipleChoice;

    return this.success({
      classRO: QuestionGetDetailRO,
      response,
      message: 'Get question detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: QuestionUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new QuestionUpdateRO();

    try {
      const questionData = new QuestionEntity();
      questionData.updatedBy = actorId;
      questionData.updatedAt = new Date();
      if (dto.text) {
        questionData.text = dto.text;
      }

      if (dto.difficultyId) {
        questionData.difficultyId = dto.difficultyId;
      }

      if (dto.isMultipleChoice) {
        questionData.isMultipleChoice = dto.isMultipleChoice;
      }

      const question = await this.questionRepository.update(id, questionData);

      response.id = question.id;
      response.text = question.text;
      response.difficultyId = question.difficultyId;
      response.isMultipleChoice = question.isMultipleChoice;
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: QuestionUpdateRO,
      response,
      message: 'Update question successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new QuestionDeleteRO();

    try {
      const question = await this.questionRepository.delete(id, actorId);

      response.id = question.id;
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: QuestionDeleteRO,
      response,
      message: 'Delete question successfully',
      actorId,
    });
  }

  private async validateStore(dto: QuestionStoreDTO, actorId: number) {
    // Check difficulty exist
    const difficultyCount = await this.difficultyRepository.countById(dto.difficultyId);
    if (!difficultyCount) {
      const { code, status, message } = EXCEPTION.DIFFICULTY.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: QuestionUpdateDTO, actorId: number) {
    // Check exist
    const questionCount = await this.questionRepository.countById(id);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check difficulty exist
    const difficultyCount = await this.difficultyRepository.countById(dto.difficultyId);
    if (!difficultyCount) {
      const { code, status, message } = EXCEPTION.DIFFICULTY.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const questionCount = await this.questionRepository.countById(id);
    if (!questionCount) {
      const { code, status, message } = EXCEPTION.QUESTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
