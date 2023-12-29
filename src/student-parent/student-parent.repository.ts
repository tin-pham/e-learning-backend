import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { StudentParentEntity } from './student-parent.entity';

@Injectable()
export class StudentParentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: StudentParentEntity[]) {
    return this.database.insertInto('studentParent').values(entities).execute();
  }

  deleteMultiple(studentIds: string[], parentIds: string[], actorId: string) {
    return this.database
      .updateTable('studentParent')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
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
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
