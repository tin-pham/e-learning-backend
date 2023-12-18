import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { GroupEntity } from './group.entity';

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

  insert(entity: GroupEntity) {
    return this.database
      .insertInto('group')
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  find() {
    return this.database
      .selectFrom('group')
      .select(['id', 'name'])
      .where('deletedAt', 'is', null)
      .execute();
  }

  update(id: string, entity: GroupEntity) {
    return this.database
      .updateTable('group')
      .set(entity)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
