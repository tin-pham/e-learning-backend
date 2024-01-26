import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { sql } from 'kysely';
import { LessonAttachmentBulkStoreDTO } from './dto/lesson-attachment.dto';

@Injectable()
export class LessonAttachmentRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('lessonAttachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertMultiple(dto: LessonAttachmentBulkStoreDTO, actorId: number) {
    return this.database
      .insertInto('lessonAttachment')
      .columns(['url', 'lessonId', 'createdBy'])
      .expression(() =>
        this.database.selectNoFrom(() => [
          sql`unnest(${dto.urls}::text[])`.as('url'),
          sql`${dto.lessonId}`.as('lessonId'),
          sql`${actorId}`.as('createdBy'),
        ]),
      )
      .execute();
  }

  deleteMultipleByIds(ids: number[], actorId: number) {
    return this.database
      .updateTable('lessonAttachment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', 'in', ids)
      .execute();
  }
}
