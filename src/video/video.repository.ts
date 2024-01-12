import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { VideoEntity } from './video.entity';

@Injectable()
export class VideoRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: VideoEntity) {
    return this.database.insertInto('video').values(entity).returning(['id', 'url']).executeTakeFirst();
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

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('video')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('video')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', '=', id)
      .returning(['id'])
      .executeTakeFirst();
  }
}
