import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { SubjectGroupEntity } from './subject-group.entity';

@Injectable()
export class SubjectGroupRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: SubjectGroupEntity[]) {
    return this.database.insertInto('subjectGroup').values(entities).execute();
  }

  deleteMultiple(subjectIds: string[], groupIds: string[], actorId: string) {
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

  async countBySubjectIdsAndGroupIds(subjectIds: string[], groupIds: string[]) {
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
