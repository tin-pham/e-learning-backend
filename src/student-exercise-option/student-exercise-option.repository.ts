import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { sql } from 'kysely';

export interface IExerciseSubmitOptionInsertMultiple {
  transaction: Transaction;
  questionSnapshotId: number;
  questionOptionSnapshotIds: number[];
  studentExerciseId: number;
}

@Injectable()
export class StudentExerciseOptionRepository {
  constructor(private readonly database: DatabaseService) {}

  getQuestionOptionByStudentExerciseIdAndQuestionId(studentExerciseId: number, questionSnapshotId: number) {
    return this.database
      .selectFrom('studentExerciseOption')
      .where('questionSnapshotId', '=', questionSnapshotId)
      .where('studentExerciseId', '=', studentExerciseId)
      .where('deletedAt', 'is', null)
      .select(['questionOptionSnapshotId'])
      .execute();
  }

  insertMultipleQuestionOptionIdsWithTransaction(data: IExerciseSubmitOptionInsertMultiple) {
    const { transaction, studentExerciseId, questionSnapshotId, questionOptionSnapshotIds } = data;
    return transaction
      .insertInto('studentExerciseOption')
      .columns(['questionOptionSnapshotId', 'studentExerciseId', 'questionSnapshotId'])
      .expression(() =>
        this.database.selectNoFrom(() => [
          sql`unnest(${questionOptionSnapshotIds}::int[])`.as('questionOptionSnapshotId'),
          sql`${studentExerciseId}`.as('studentExerciseId'),
          sql`${questionSnapshotId}`.as('questionSnapshotId'),
        ]),
      )
      .execute();
  }
}
