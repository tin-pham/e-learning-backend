import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { LessonAttachmentEntity } from './lesson-attachment.entity';

@Injectable()
export class LessonAttachmentRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByLessonIdsAndAttachmentIds(lessonIds: number[], attachmentIds: number[]) {
    const { count } = await this.database
      .selectFrom('lessonAttachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lessonId', 'in', lessonIds)
      .where('attachmentId', 'in', attachmentIds)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertMultiple(entities: LessonAttachmentEntity[]) {
    return this.database.insertInto('lessonAttachment').values(entities).execute();
  }

  deleteMultipleByLessonIdsAndAttachmentIds(lessonIds: number[], attachmentIds: number[], actorId: number) {
    return this.database
      .updateTable('lessonAttachment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('lessonId', 'in', lessonIds)
      .where('attachmentId', 'in', attachmentIds)
      .execute();
  }
}
