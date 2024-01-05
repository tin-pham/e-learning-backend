import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ClassroomYearStudentEntity } from './classroom-year-student.entity';

@Injectable()
export class ClassroomYearStudentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMany(entities: ClassroomYearStudentEntity[]) {
    return this.database
      .insertInto('classroomYearStudent')
      .values(entities)
      .execute();
  }

  async countByClassroomYearIdsAndStudentIds(
    classroomYearIds: number[],
    studentIds: string[],
  ) {
    const { count } = await this.database
      .selectFrom('classroomYearStudent')
      .where('classroomYearId', 'in', classroomYearIds)
      .where('studentId', 'in', studentIds)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirstOrThrow();
    return Number(count);
  }
}
