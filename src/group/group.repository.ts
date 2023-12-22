import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { GroupEntity } from './group.entity';
import { GroupGetListDTO } from './dto/group.dto';
import { paginate } from 'src/common/function/paginate';

@Injectable()
export class GroupRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('group')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: string) {
    const { count } = await this.database
      .selectFrom('group')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: string[]) {
    const { count } = await this.database
      .selectFrom('group')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: string) {
    const { count } = await this.database
      .selectFrom('group')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();

    return Number(count);
  }

  findOneById(id: string) {
    return this.database
      .selectFrom('group')
      .selectAll()
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  insert(entity: GroupEntity) {
    return this.database
      .insertInto('group')
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  find(dto: GroupGetListDTO) {
    const withSubject = Boolean(dto.subjectId);

    const query = this.database
      .selectFrom('group')
      .select(['group.id', 'group.name'])
      .where('group.deletedAt', 'is', null)
      .$if(withSubject, (query) =>
        query
          .innerJoin('subjectGroup', 'subjectGroup.groupId', 'group.id')
          .innerJoin('subject', 'subject.id', 'subjectGroup.subjectId')
          .where('subjectGroup.subjectId', '=', dto.subjectId)
          .where('subject.deletedAt', 'is', null),
      );

    return paginate(query, {
      limit: dto.limit,
      page: dto.page,
    });
  }

  update(id: string, entity: GroupEntity) {
    return this.database
      .updateTable('group')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  delete(id: string, entity: GroupEntity) {
    return this.database
      .updateTable('group')
      .set(entity)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
