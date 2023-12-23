import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { StudentParentEntity } from './student-parent.entity';

@Injectable()
export class StudentParentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: StudentParentEntity[]) {
    return this.database.insertInto('studentParent').values(entities).execute();
  }

  deleteMultiple(studentIds: string[], parentIds: string[]) {
    return this.database
      .deleteFrom('studentParent')
      .where('studentId', 'in', studentIds)
      .where('parentId', 'in', parentIds)
      .execute();
  }

  async countByStudentIdsAndParentIds(
    studentIds: string[],
    parentIds: string[],
  ) {
    const { count } = await this.database
      .selectFrom('studentParent')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('studentId', 'in', studentIds)
      .where('parentId', 'in', parentIds)
      .executeTakeFirst();
    return Number(count);
  }
}
