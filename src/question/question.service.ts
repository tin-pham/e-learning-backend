import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { QuestionEntity } from './question.entity';
import { QuestionRepository } from './question.repository';
import { DifficultyRepository } from '../difficulty/difficulty.repository';
import { QuestionCategoryHasQuestionRepository } from '../question-category-has-question/question-category-has-question.repository';
import { QuestionCategoryRepository } from '../question-category/question-category.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { QuestionOptionEntity } from '../question-option/question-option.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { QuestionGetListDTO, QuestionStoreDTO, QuestionUpdateDTO } from './dto/question.dto';
import { QuestionDeleteRO, QuestionGetDetailRO, QuestionGetListRO, QuestionStoreRO, QuestionUpdateRO } from './ro/question.ro';

@Injectable()
export class QuestionService extends BaseService {
  private readonly logger = new Logger(QuestionService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly questionRepository: QuestionRepository,
    private readonly questionOptionRepository: QuestionOptionRepository,
    private readonly difficultyRepository: DifficultyRepository,
    private readonly questionCategoryRepository: QuestionCategoryRepository,
    private readonly questionCategoryHasQuestionRepository: QuestionCategoryHasQuestionRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: QuestionStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { isMultipleChoice } = await this.validateStore(dto, actorId);

    const response = new QuestionStoreRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        const questionData = new QuestionEntity();
        questionData.text = dto.text;
        questionData.difficultyId = dto.difficultyId;
        questionData.isMultipleChoice = isMultipleChoice;
        questionData.createdBy = actorId;
        const question = await this.questionRepository.insertWithTransaction(transaction, questionData);

        const questionOptionData = dto.options.map((option) => {
          return new QuestionOptionEntity({
            text: option.text,
            isCorrect: option.isCorrect,
            questionId: question.id,
          });
        });
        await this.questionOptionRepository.insertMultipleWithTransaction(transaction, questionOptionData);

        if (dto.questionCategoryIds) {
          const questionCategoryHasQuestionEntities = dto.questionCategoryIds.map((questionCategoryId) => ({
            questionId: question.id,
            questionCategoryId,
          }));

          await this.questionCategoryHasQuestionRepository.insertMultipleWithTransaction(transaction, questionCategoryHasQuestionEntities);
        }

        response.id = question.id;
        response.text = question.text;
        response.difficultyId = question.difficultyId;
        response.isMultipleChoice = question.isMultipleChoice;
      });
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

    let response: any;

    try {
      response = await this.questionRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.QUESTION.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!response) {
      const { code, status, message } = EXCEPTION.QUESTION.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: QuestionGetDetailRO,
      response,
      message: 'Get question detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: QuestionUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { isMultipleChoice } = await this.validateUpdate(id, dto, actorId);

    const response = new QuestionUpdateRO();

    try {
      const questionData = new QuestionEntity();
      questionData.updatedBy = actorId;
      questionData.updatedAt = new Date();
      questionData.isMultipleChoice = isMultipleChoice;
      if (dto.text) {
        questionData.text = dto.text;
      }

      if (dto.difficultyId) {
        questionData.difficultyId = dto.difficultyId;
      }

      await this.database.transaction().execute(async (transaction) => {
        const question = await this.questionRepository.updateWithTransaction(transaction, id, questionData);

        console.log(dto);
        if (dto.removeOptionIds && dto.removeOptionIds.length) {
          await this.questionOptionRepository.deleteByIdsWithTransaction(transaction, dto.removeOptionIds, actorId);
        }

        if (dto.options && dto.options.length) {
          const questionOptionData = dto.options.map(
            (option) =>
              new QuestionOptionEntity({
                text: option.text,
                isCorrect: option.isCorrect,
                questionId: question.id,
              }),
          );
          await this.questionOptionRepository.insertMultipleWithTransaction(transaction, questionOptionData);
        }

        response.id = question.id;
        response.text = question.text;
        response.difficultyId = question.difficultyId;
        response.isMultipleChoice = question.isMultipleChoice;
      });
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

    // Check question category ids exist
    if (dto.questionCategoryIds) {
      const questionCategoryCount = await this.questionCategoryRepository.countByIds(dto.questionCategoryIds);
      if (!questionCategoryCount) {
        const { code, status, message } = EXCEPTION.QUESTION_CATEGORY.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    // Check duplicate isCorrect
    const isCorrects = dto.options.map((option) => option.isCorrect);
    let isMultipleChoice = false;
    if (isCorrects.length > 1) {
      isMultipleChoice = true;
    }

    // Should contain both true and false
    const allTrue = isCorrects.every((value) => value === true);
    const allFalse = isCorrects.every((value) => value === false);
    console.log(allFalse);
    if (allTrue || allFalse) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.IS_CORRECT_DIVERSITY_REQUIRED;
      this.throwException({ code, status, message, actorId });
    }

    // Check text unique in same question
    const texts = dto.options.map((option) => option.text);
    if (texts.length !== new Set(texts).size) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.TEXT_DUPLICATE;
      this.throwException({ code, status, message, actorId });
    }

    // Check question unique in same category
    if (dto.questionCategoryIds) {
      const questionCount = await this.questionCategoryHasQuestionRepository.countByQuestionTextAndCategoryIds(
        dto.text,
        dto.questionCategoryIds,
      );
      if (questionCount) {
        const { code, status, message } = EXCEPTION.QUESTION.ALREADY_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    return { isMultipleChoice };
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

    // Check remove option id exist with question
    if (dto.removeOptionIds && dto.removeOptionIds.length) {
      const removeOptionsCount = await this.questionOptionRepository.countByIdsAndQuestionId(dto.removeOptionIds, id);
      if (!removeOptionsCount) {
        const { code, status, message } = EXCEPTION.QUESTION_OPTION.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    const currentOptions = await this.questionOptionRepository.findByQuestionId(id);
    let remainingOptions: Partial<QuestionOptionEntity>[] = currentOptions;
    if (dto.removeOptionIds && dto.removeOptionIds.length) {
      remainingOptions = currentOptions.filter((option) => !dto.removeOptionIds.includes(option.id));
    }

    if (dto.options && dto.options.length) {
      remainingOptions.push(...dto.options);
    }

    // Check text unique in same question
    const texts = remainingOptions.map((option) => option.text);
    if (texts.length !== new Set(texts).size) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.TEXT_DUPLICATE;
      this.throwException({ code, status, message, actorId });
    }

    //  It should contain both true and false
    const isCorrects = remainingOptions.map((option) => option.isCorrect);
    const allTrue = isCorrects.every((value) => value === true);
    const allFalse = isCorrects.every((value) => value === false);
    if (allTrue || allFalse) {
      const { code, status, message } = EXCEPTION.QUESTION_OPTION.IS_CORRECT_DIVERSITY_REQUIRED;
      this.throwException({ code, status, message, actorId });
    }

    // Check question unique in same category
    const questionCategoryHasCategories = await this.questionCategoryHasQuestionRepository.getCategoryIdsByQuestionId(id);
    const questionCategoryIds = questionCategoryHasCategories.map(
      (questionCategoryHasQuestion) => questionCategoryHasQuestion.questionCategoryId,
    );
    const questionCountByQuestionText = await this.questionCategoryHasQuestionRepository.countByQuestionTextAndCategoryIdsExceptId(
      dto.text,
      questionCategoryIds,
      id,
    );
    if (questionCountByQuestionText) {
      const { code, status, message } = EXCEPTION.QUESTION.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // It should adjust isMultipleChoice
    let isMultipleChoice = false;
    if (isCorrects.length > 1) {
      isMultipleChoice = true;
    }

    return { isMultipleChoice };
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
