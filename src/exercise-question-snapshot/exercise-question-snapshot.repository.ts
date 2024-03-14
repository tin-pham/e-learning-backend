import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService, Transaction } from '../database';

@Injectable()
export class ExerciseQuestionSnapshotRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('exerciseQuestionSnapshot')
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  getIdsByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('exerciseQuestionSnapshot')
      .select(['id'])
      .where('exerciseId', '=', exerciseId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  deleteByExerciseIdWithTransaction(transaction: Transaction, exerciseId: number) {
    return transaction.deleteFrom('exerciseQuestionSnapshot').where('exerciseId', '=', exerciseId).where('deletedAt', 'is', null).execute();
  }

  insertMultipleByQuestionIdsWithTransaction(transaction: Transaction, questionIds: number[], exerciseId: number) {
    return transaction
      .with('question_data', (qb) =>
        qb
          .selectFrom('question')
          .select(['text', 'difficultyId', 'isMultipleChoice', 'id'])
          .where('id', 'in', questionIds)
          .where('deletedAt', 'is', null),
      )
      .insertInto('exerciseQuestionSnapshot')
      .columns(['questionId', 'text', 'difficultyId', 'isMultipleChoice', 'exerciseId'])
      .expression((eb) =>
        eb
          .selectFrom('question_data')
          .select(({ ref }) => [
            ref('id').as('questionId'),
            ref('text').as('text'),
            ref('difficultyId').as('difficultyId'),
            ref('isMultipleChoice').as('isMultipleChoice'),
            sql`${exerciseId}`.as('exerciseId'),
          ]),
      )
      .execute();
  }
}
