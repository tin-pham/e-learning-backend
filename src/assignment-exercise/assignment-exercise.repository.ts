import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { sql } from 'kysely';

export interface IAssignmentExerciseInsertMultipleByExerciseIds {
  assignmentId: number;
  exerciseIds: number[];
  actorId: number;
}

@Injectable()
export class AssignmentExerciseRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultipleByAssignmentIdsAndExerciseIds(assignmentIds: number[], exerciseIds: number[], actorId: number) {
    return this.database
      .with('assignmentIds', (eb) => eb.selectNoFrom([sql`unnest(${assignmentIds}::int[])`.as('assignmentId')]))
      .with('exerciseIds', (eb) => eb.selectNoFrom([sql`unnest(${exerciseIds}::int[])`.as('exerciseId')]))
      .insertInto('assignmentExercise')
      .columns(['assignmentId', 'exerciseId', 'createdBy'])
      .expression((eb) =>
        eb
          .selectFrom('assignmentIds')
          .innerJoin('exerciseIds', (join) => join.onTrue())
          .select(['assignmentIds.assignmentId', 'exerciseIds.exerciseId', sql`${actorId}`.as('createdBy')]),
      )
      .execute();
  }

  insertMultipleByExerciseIdsWithTransaction(transaction: Transaction, data: IAssignmentExerciseInsertMultipleByExerciseIds) {
    return transaction
      .insertInto('assignmentExercise')
      .columns(['exerciseId', 'assignmentId', 'createdBy'])
      .expression(() =>
        this.database.selectNoFrom(() => [
          sql`unnest(${data.exerciseIds}::int[])`.as('exerciseId'),
          sql`${data.assignmentId}`.as('assignmentId'),
          sql`${data.actorId}`.as('createdBy'),
        ]),
      )
      .execute();
  }

  deleteMultipleByAssignmentIdsAndExerciseIds(assignmentIds: number[], exerciseIds: number[], actorId: number) {
    return this.database
      .updateTable('assignmentExercise')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('assignmentId', 'in', assignmentIds)
      .where('exerciseId', 'in', exerciseIds)
      .where('deletedAt', 'is', null)
      .execute();
  }

  async countByAssignmentIdsAndExerciseIds(assignmentIds: number[], exerciseIds: number[]) {
    const { count } = await this.database
      .selectFrom('assignmentExercise')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignmentId', 'in', assignmentIds)
      .where('exerciseId', 'in', exerciseIds)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
