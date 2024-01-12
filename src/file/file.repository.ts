import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { FileEntity } from './file.entity';

@Injectable()
export class FileRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: FileEntity) {
    return this.database.insertInto('file').values(entity).returning(['id', 'url']).executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('file')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('file')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('file.id', '=', id)
      .where('file.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('file')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('file.id', 'in', ids)
      .where('file.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
