import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { VideoEntity } from './video.entity';

@Injectable()
export class VideoRepository {
  insertWithTransaction(transaction: Transaction, entity: VideoEntity) {
    return transaction.insertInto('video').values(entity).returning(['id', 'url', 'duration']).executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('video')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .returning(['id', 'url', 'duration'])
      .executeTakeFirst();
  }

  updateWithTransaction(transaction: Transaction, id: number, entity: VideoEntity) {
    return transaction.updateTable('video').set(entity).where('id', '=', id).returning(['id', 'url', 'duration']).executeTakeFirst();
  }
}
