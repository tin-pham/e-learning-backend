import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { VideoEntity } from './video.entity';

@Injectable()
export class VideoRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: VideoEntity) {
    return this.database.insertInto('video').values(entity).returning(['id', 'url', 'lessonId']).executeTakeFirst();
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('video')
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .select(['id', 'url', 'lessonId'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('video')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('video')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
