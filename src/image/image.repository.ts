import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { ImageEntity } from './image.entity';

@Injectable()
export class ImageRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: ImageEntity) {
    return transaction
      .insertInto('image')
      .values(entity)
      .returning(['id', 'url', 'name', 'type', 'size', 'createdAt', 'createdBy'])
      .executeTakeFirst();
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('image')
      .select(['id', 'url', 'name', 'type', 'size', 'createdAt', 'createdBy'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('image')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('image')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .returning(['id', 'url'])
      .executeTakeFirst();
  }
}
