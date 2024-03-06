import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { CourseAssignmentEntity } from './course-assignment.entity';

@Injectable()
export class CourseAssignmentRepository {
  deleteByCourseIdWithTransaction(transaction: Transaction, courseId: number, actorId: number) {
    return transaction
      .updateTable('courseAssignment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  storeWithTransaction(transaction: Transaction, entity: CourseAssignmentEntity) {
    return transaction.insertInto('courseAssignment').values(entity).returning(['id']).executeTakeFirst();
  }
}
