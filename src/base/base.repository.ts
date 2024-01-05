import { Injectable } from '@nestjs/common';
import { DatabaseService, KyselyTables } from '../database';

@Injectable()
export abstract class BaseRepository<Entity> {
  protected abstract readonly tableName: keyof KyselyTables;
  constructor(protected readonly database: DatabaseService) {}

  insert(entity: Entity): Promise<Entity> {
    return this.database
      .insertInto(this.tableName)
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow() as Promise<Entity>;
  }

  update(id: number, entity: Entity): Promise<Entity> {
    return this.database
      .updateTable(this.tableName)
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirstOrThrow() as Promise<Entity>;
  }

  delete(id: number, entity: Entity) {
    return this.database
      .updateTable(this.tableName)
      .set(entity)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom(this.tableName)
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: string[]) {
    const { count } = await this.database
      .selectFrom(this.tableName)
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
