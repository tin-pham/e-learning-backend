import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { SubjectGroupEntity } from './subject-group.entity';

@Injectable()
export class SubjectGroupRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: SubjectGroupEntity[]) {
    return this.database.insertInto('subjectGroup').values(entities).execute();
  }

  async countBySubjectIdsAndGroupIds(subjectIds: string[], groupIds: string[]) {
    const { count } = await this.database
      .selectFrom('subjectGroup')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('subjectId', 'in', subjectIds)
      .where('groupId', 'in', groupIds)
      .executeTakeFirst();
    return Number(count);
  }
}
