import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { QuestionEntity } from './question.entity';
import { QuestionGetListDTO } from './dto/question.dto';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { sql } from 'kysely';

@Injectable()
export class QuestionRepository {
  constructor(private readonly database: DatabaseService) {}

  getIdsByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('question')
      .select(['question.id'])
      .where('question.deletedAt', 'is', null)
      .innerJoin('exerciseQuestion', 'exerciseQuestion.questionId', 'question.id')
      .where('exerciseQuestion.deletedAt', 'is', null)
      .where('exerciseQuestion.exerciseId', '=', exerciseId)
      .innerJoin('exercise', 'exercise.id', 'exerciseQuestion.questionId')
      .where('exercise.deletedAt', 'is', null)
      .execute();
  }

  find(dto: QuestionGetListDTO) {
    const { page, limit, questionCategoryId } = dto;

    const byCategory = Boolean(questionCategoryId);

    const query = this.database
      .selectFrom('question')
      .where('question.deletedAt', 'is', null)
      .innerJoin('difficulty', 'difficulty.id', 'question.difficultyId')
      .where('difficulty.deletedAt', 'is', null)
      .leftJoin('questionOption', (join) =>
        join.onRef('question.id', '=', 'questionOption.questionId').on('questionOption.deletedAt', 'is', null),
      )
      .groupBy(['question.id', 'question.text', 'question.difficultyId', 'difficulty.name', 'question.isMultipleChoice'])
      .$if(byCategory, (qb) =>
        qb
          .leftJoin('questionCategoryHasQuestion', (join) =>
            join
              .onRef('question.id', '=', 'questionCategoryHasQuestion.questionId')
              .on('questionCategoryHasQuestion.deletedAt', 'is', null),
          )
          .leftJoin('questionCategory', (join) =>
            join
              .onRef('questionCategoryHasQuestion.questionCategoryId', '=', 'questionCategory.id')
              .on('questionCategory.deletedAt', 'is', null),
          )
          .where('questionCategory.id', '=', questionCategoryId),
      )
      .select(({ fn, ref }) => [
        'question.id',
        'question.text',
        'question.difficultyId',
        'difficulty.name as diffulltyName',
        'question.isMultipleChoice',
        fn
          .coalesce(
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref('questionOption.id'),
                  text: ref('questionOption.text'),
                  isCorrect: ref('questionOption.isCorrect'),
                }),
              )
              .filterWhere('questionOption.id', 'is not', null),
            sql`'[]'`,
          )
          .as('options'),
      ])
      .orderBy('question.createdAt', 'desc');

    return paginate(query, {
      page,
      limit,
    });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('question')
      .select(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  insertWithTransaction(transaction: Transaction, entity: QuestionEntity) {
    return transaction
      .insertInto('question')
      .values(entity)
      .returning(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .executeTakeFirst();
  }

  updateWithTransaction(transaction: Transaction, id: number, entity: QuestionEntity) {
    return transaction
      .updateTable('question')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('question')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('question')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('question')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
