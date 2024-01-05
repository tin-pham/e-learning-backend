import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ClassroomYearAssignmentEntity } from './classroom-year-assignment.entity';

@Injectable()
export class ClassroomYearAssignmentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMany(entities: ClassroomYearAssignmentEntity[]) {
    return this.database
      .insertInto('classroomYearAssignment')
      .values(entities)
      .execute();
  }

  async countByClassroomYearIdsAndTeacherSubjectIds(
    classroomYearIds: number[],
    teacherSubjectIds: number[],
  ) {
    const { count } = await this.database
      .selectFrom('classroomYearAssignment')
      .where('classroomYearId', 'in', classroomYearIds)
      .where('teacherSubjectId', 'in', teacherSubjectIds)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirstOrThrow();
    return Number(count);
  }
}
