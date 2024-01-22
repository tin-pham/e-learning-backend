import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { CourseStudentEntity } from './course-student.entity';

@Injectable()
export class CourseStudentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: CourseStudentEntity[]) {
    return this.database.insertInto('courseStudent').values(entities).execute();
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
}
