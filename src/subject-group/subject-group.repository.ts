import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { SubjectGroupEntity } from './subject-group.entity';

@Injectable()
export class SubjectGroupRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: SubjectGroupEntity[]) {
    return this.database.insertInto('subjectGroup').values(entities).execute();
  }

  deleteMultiple(subjectIds: number[], groupIds: number[], actorId: number) {
    return this.database
      .updateTable('subjectGroup')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('subjectId', 'in', subjectIds)
      .where('groupId', 'in', groupIds)
      .execute();
  }

  async countBySubjectIdsAndGroupIds(subjectIds: number[], groupIds: number[]) {
    const { count } = await this.database
      .selectFrom('subjectGroup')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('subjectId', 'in', subjectIds)
      .where('groupId', 'in', groupIds)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
