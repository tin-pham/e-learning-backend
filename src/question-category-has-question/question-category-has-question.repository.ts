import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { QuestionCategoryHasQuestionEntity } from './question-category-has-question.entity';
import { sql } from 'kysely';

@Injectable()
export class QuestionCategoryHasQuestionRepository {
  constructor(private readonly database: DatabaseService) {}

  deleteMultipleByQuestionCategoryIdWithTransaction(transaction: Transaction, questionCategoryId: number, actorId: number) {
    return transaction
      .updateTable('questionCategoryHasQuestion')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('questionCategoryId', '=', questionCategoryId)
      .where('deletedAt', 'is', null)
      .returning(['questionId'])
      .execute();
  }

  getCategoryIdsByQuestionId(questionId: number) {
    return this.database
      .selectFrom('questionCategoryHasQuestion')
      .select('questionCategoryId')
      .where('questionCategoryHasQuestion.deletedAt', 'is', null)
      .where('questionId', '=', questionId)
      .execute();
  }

  async countByQuestionTextAndCategoryIdsExceptId(text: string, questionCategoryIds: number[], id: number) {
    const { count } = await this.database
      .selectFrom('questionCategoryHasQuestion')
      .where('questionCategoryHasQuestion.deletedAt', 'is', null)
      .where('questionCategoryHasQuestion.id', '!=', id)
      .select(({ fn }) => fn.countAll().as('count'))
      .innerJoin('question', 'question.id', 'questionCategoryHasQuestion.questionId')
      .where('question.text', '=', text)
      .where('question.deletedAt', 'is', null)
      .innerJoin('questionCategory', 'questionCategory.id', 'questionCategoryHasQuestion.questionCategoryId')
      .where('questionCategory.id', 'in', questionCategoryIds)
      .where('questionCategory.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByQuestionTextAndCategoryIds(questionText: string, questionCategoryIds: number[]) {
    const { count } = await this.database
      .selectFrom('questionCategoryHasQuestion')
      .where('questionCategoryHasQuestion.deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .innerJoin('question', 'question.id', 'questionCategoryHasQuestion.questionId')
      .where('question.text', '=', questionText)
      .where('question.deletedAt', 'is', null)
      .innerJoin('questionCategory', 'questionCategory.id', 'questionCategoryHasQuestion.questionCategoryId')
      .where('questionCategory.id', 'in', questionCategoryIds)
      .where('questionCategory.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertMultipleWithTransaction(transaction: Transaction, entities: QuestionCategoryHasQuestionEntity[]) {
    return transaction.insertInto('questionCategoryHasQuestion').values(entities).execute();
  }

  async updateByQuestionCategoryIdsAndQuestionIdWithTransaction(
    transaction: Transaction,
    questionCategoryIds: number[],
    questionId: number,
    actorId: number,
  ) {
    if (questionCategoryIds && questionCategoryIds.length) {
      await transaction.deleteFrom('questionCategoryHasQuestion').where('questionCategoryId', 'not in', questionCategoryIds).execute();
      return transaction
        .insertInto('questionCategoryHasQuestion')
        .columns(['questionCategoryId', 'questionId', 'createdBy'])
        .expression(() =>
          transaction.selectNoFrom(() => [
            sql`unnest(${questionCategoryIds}::int[])`.as('questionCategoryId'),
            sql`${questionId}`.as('questionId'),
            sql`${actorId}`.as('createdBy'),
          ]),
        )
        .onConflict((oc) => oc.doNothing())
        .execute();
    } else {
      return transaction.deleteFrom('questionCategoryHasQuestion').where('questionId', '=', questionId).execute();
    }
  }
}
