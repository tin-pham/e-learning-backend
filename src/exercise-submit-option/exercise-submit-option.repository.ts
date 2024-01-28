import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { sql } from 'kysely';

export interface IExerciseSubmitOptionInsertMultiple {
  transaction: Transaction;
  questionOptionIds: number[];
  questionId: number;
  exerciseSubmitId: number;
}

@Injectable()
export class ExerciseSubmitOptionRepository {
  constructor(private readonly database: DatabaseService) {}

  getQuestionOptionByExerciseSubmitIdAndQuestionId(exerciseSubmitId: number, questionId: number) {
    return this.database
      .selectFrom('exerciseSubmitOption')
      .select(['questionOptionId'])
      .where('questionId', '=', questionId)
      .where('exerciseSubmitId', '=', exerciseSubmitId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  insertMultipleQuestionOptionIdsWithTransaction(data: IExerciseSubmitOptionInsertMultiple) {
    const { transaction, questionOptionIds, questionId, exerciseSubmitId } = data;
    return transaction
      .insertInto('exerciseSubmitOption')
      .columns(['questionOptionId', 'exerciseSubmitId', 'questionId'])
      .expression(() =>
        this.database.selectNoFrom(() => [
          sql`unnest(${questionOptionIds}::int[])`.as('questionOptionId'),
          sql`${exerciseSubmitId}`.as('exerciseSubmitId'),
          sql`${questionId}`.as('questionId'),
        ]),
      )
      .execute();
  }
}
