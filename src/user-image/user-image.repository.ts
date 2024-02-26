import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { UserImageEntity } from './user-image.entity';

@Injectable()
export class UserImageRepository {
  //constructor(private readonly database: DatabaseService) {}

  deleteByUserIdAndImageIdWithTransaction(transaction: Transaction, userId: number, imageId: number, actorId: number) {
    return transaction
      .updateTable('userImage')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('userId', '=', userId)
      .where('imageId', '=', imageId)
      .execute();
  }

  insertWithTransaction(transaction: Transaction, entity: UserImageEntity) {
    return transaction.insertInto('userImage').values(entity).returning(['id', 'userId', 'imageId']).execute();
  }

  deleteByUserIdWithTransaction(transaction: Transaction, userId: number, actorId: number) {
    return transaction
      .updateTable('userImage')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('userId', '=', userId)
      .returning(['id', 'imageId', 'userId'])
      .executeTakeFirst();
  }
}
