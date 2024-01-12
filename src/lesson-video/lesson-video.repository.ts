import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { LessonVideoEntity } from './lesson-video.entity';

@Injectable()
export class LessonVideoRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByLessonIdsAndVideoIds(lessonIds: number[], videoIds: number[]) {
    const { count } = await this.database
      .selectFrom('lessonVideo')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lessonId', 'in', lessonIds)
      .where('videoId', 'in', videoIds)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertMultiple(entities: LessonVideoEntity[]) {
    return this.database.insertInto('lessonVideo').values(entities).execute();
  }

  deleteMultipleByLessonIdsAndVideoIds(lessonIds: number[], videoIds: number[], actorId: number) {
    return this.database
      .updateTable('lessonVideo')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('lessonId', 'in', lessonIds)
      .where('videoId', 'in', videoIds)
      .execute();
  }
}
