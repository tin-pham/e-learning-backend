import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { CourseAssignmentEntity } from './course-assignment.entity';

@Injectable()
export class CourseAssignmentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: CourseAssignmentEntity[]) {
    return this.database.insertInto('courseAssignment').values(entities).execute();
  }

  deleteByCourseIdsAndAssignmentIds(courseIds: number[], assignmentIds: number[], actorId: number) {
    return this.database
      .updateTable('courseAssignment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('courseId', 'in', courseIds)
      .where('assignmentId', 'in', assignmentIds)
      .where('deletedAt', 'is', null)
      .execute();
  }

  deleteByCourseIdWithTransaction(transaction: Transaction, courseId: number, actorId: number) {
    return transaction
      .updateTable('courseAssignment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  async countByCouseIdsAndAssignmentIds(courseIds: number[], assignmentIds: number[]) {
    const { count } = await this.database
      .selectFrom('courseAssignment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('courseId', 'in', courseIds)
      .where('assignmentId', 'in', assignmentIds)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
