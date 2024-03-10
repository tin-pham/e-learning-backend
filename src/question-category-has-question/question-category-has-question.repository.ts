import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/database';
import { QuestionCategoryHasQuestionEntity } from './question-category-has-question.entity';
import { sql } from 'kysely';

@Injectable()
export class QuestionCategoryHasQuestionRepository {
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
