import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { sql } from 'kysely';

export interface IAssignmentExerciseInsertMultiple {
  assignmentIds: number[];
  exerciseIds: number[];
  createdBy: number;
}

@Injectable()
export class AssignmentExerciseRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMulitpleByAssignmentIdsAndExerciseIds(assignmentIds: number[], exerciseIds: number[], actorId: number) {
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
