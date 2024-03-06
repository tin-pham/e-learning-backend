import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { CourseStudentEntity } from './course-student.entity';

@Injectable()
export class CourseStudentRepository {
  constructor(private readonly database: DatabaseService) {}

  getStudentIdsByCourseId(courseId: number) {
    return this.database
      .selectFrom('courseStudent')
      .select(['studentId'])
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  insert(entity: CourseStudentEntity) {
    return this.database.insertInto('courseStudent').values(entity).returning(['id', 'courseId', 'studentId']).executeTakeFirst();
  }

  insertMultiple(entities: CourseStudentEntity[]) {
    return this.database.insertInto('courseStudent').values(entities).execute();
  }

  deleteByCourseIdAndStudentId(courseId: number, studentId: string, actorId: number) {
    return this.database
      .updateTable('courseStudent')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('courseId', '=', courseId)
      .where('studentId', '=', studentId)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  deleteByCourseIdWithTransaction(transaction: Transaction, courseId: number, actorId: number) {
    return transaction
      .updateTable('courseStudent')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  deleteMultipleByCourseIdsAndStudentIds(courseIds: number[], studentIds: string[], actorId: number) {
    return this.database
      .updateTable('courseStudent')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('courseId', 'in', courseIds)
      .where('studentId', 'in', studentIds)
      .where('deletedAt', 'is', null)
      .execute();
  }

  async countByCourseIdsAndStudentIds(courseIds: number[], studentIds: string[]) {
    const { count } = await this.database
      .selectFrom('courseStudent')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('courseId', 'in', courseIds)
      .where('studentId', 'in', studentIds)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByCourseIdAndStudentId(courseId: number, studentId: string) {
    const { count } = await this.database
      .selectFrom('courseStudent')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('courseId', '=', courseId)
      .where('studentId', '=', studentId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
