import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { sql } from 'kysely';

export interface IExerciseSubmitOptionInsertMultiple {
  transaction: Transaction;
  questionSnapshotId: number;
  questionOptionSnapshotIds: number[];
  studentExerciseId: number;
  createdBy: number;
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
    const { transaction, studentExerciseId, questionSnapshotId, questionOptionSnapshotIds, createdBy } = data;
    return transaction
      .insertInto('studentExerciseOption')
      .columns(['questionOptionSnapshotId', 'studentExerciseId', 'questionSnapshotId', 'createdBy'])
      .expression(() =>
        this.database.selectNoFrom(() => [
          sql`unnest(${questionOptionSnapshotIds}::int[])`.as('questionOptionSnapshotId'),
          sql`${studentExerciseId}`.as('studentExerciseId'),
          sql`${questionSnapshotId}`.as('questionSnapshotId'),
          sql`${createdBy}`.as('createdBy'),
        ]),
      )
      .execute();
  }

  deleteByStudentExerciseIdWithTransaction(transaction: Transaction, studentExerciseId: number) {
    return transaction
      .deleteFrom('studentExerciseOption')
      .where('studentExerciseId', '=', studentExerciseId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  deleteByExerciseQuestionSnapshotIdsWithTransaction(transaction: Transaction, questionSnapshotIds: number[]) {
    return transaction
      .deleteFrom('studentExerciseOption')
      .where('questionSnapshotId', 'in', questionSnapshotIds)
      .where('deletedAt', 'is', null)
      .execute();
  }
}
