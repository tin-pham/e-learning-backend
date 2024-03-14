import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { QuestionCategoryRepository } from './question-category.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { QuestionCategoryGetListDTO, QuestionCategoryStoreDTO, QuestionCategoryUpdateDTO } from './dto/question-category.dto';
import { QuestionCategoryEntity } from './question-category.entity';
import {
  QuestionCategoryDeleteRO,
  QuestionCategoryGetListRO,
  QuestionCategoryGetDetailRO,
  QuestionCategoryStoreRO,
  QuestionCategoryUpdateRO,
} from './ro/question-category.ro';

@Injectable()
export class QuestionCategoryService extends BaseService {
  private readonly logger = new Logger(QuestionCategoryService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly questionCategoryRepository: QuestionCategoryRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: QuestionCategoryStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    let response: QuestionCategoryStoreRO;

    try {
      const questionCategoryData = new QuestionCategoryEntity({
        name: dto.name,
        createdBy: actorId,
      });

      const questionCategory = await this.questionCategoryRepository.insert(questionCategoryData);

      response = new QuestionCategoryStoreRO({
        id: questionCategory.id,
        name: questionCategory.name,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: QuestionCategoryStoreRO,
      response,
      message: 'Question category created successfully',
      actorId,
    });
  }

  async getList(dto: QuestionCategoryGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.questionCategoryRepository.find(dto);
      console.log(response);

      return this.success({
        classRO: QuestionCategoryGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    let response: any;

    try {
      response = await this.questionCategoryRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    if (!response) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: QuestionCategoryGetDetailRO,
      response,
    });
  }

  async update(id: number, dto: QuestionCategoryUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);
    let response: QuestionCategoryUpdateRO;

    try {
      const questionCategoryData = new QuestionCategoryEntity({
        name: dto.name,
        updatedBy: actorId,
        updatedAt: new Date(),
      });

      const questionCategory = await this.questionCategoryRepository.update(id, questionCategoryData);
      response = new QuestionCategoryUpdateRO({
        id: questionCategory.id,
        name: questionCategory.name,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: QuestionCategoryUpdateRO,
      response,
      message: 'Question category updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    let response: QuestionCategoryDeleteRO;

    try {
      const questionCategory = await this.questionCategoryRepository.delete(id, actorId);

      response = new QuestionCategoryDeleteRO({
        id: questionCategory.id,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: QuestionCategoryDeleteRO,
      response,
      message: 'Question category deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: QuestionCategoryStoreDTO, actorId: number) {
    // Check name exist
    const count = await this.questionCategoryRepository.countByName(dto.name);
    if (count) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: QuestionCategoryUpdateDTO, actorId: number) {
    // Check exist
    const questionCategoryCount = await this.questionCategoryRepository.countById(id);
    if (!questionCategoryCount) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check name unique except id
    const questionCategoryUniqueCount = await this.questionCategoryRepository.countByName(dto.name);
    if (questionCategoryUniqueCount) {
      const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
