import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { VideoEntity } from './video.entity';

@Injectable()
export class VideoRepository {
  constructor(private readonly database: DatabaseService) {}

  getIdByLessonId(lessonId: number) {
    return this.database.selectFrom('video').select(['id']).where('id', '=', lessonId).where('deletedAt', 'is', null).executeTakeFirst();
  }

  insertWithTransaction(transaction: Transaction, entity: VideoEntity) {
    return transaction.insertInto('video').values(entity).returning(['id', 'url', 'duration']).executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction.updateTable('video').set({ deletedAt: new Date(), deletedBy: actorId }).where('id', '=', id).execute();
  }
}
