import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { LessonAttachmentEntity } from './lesson-attachment.entity';
import { LessonAttachmentGetListDTO } from './dto/lesson-attachment.dto';
import { paginate } from '../common/function/paginate';

@Injectable()
export class LessonAttachmentRepository {
  constructor(private readonly database: DatabaseService) {}

  findByLessonId(dto: LessonAttachmentGetListDTO) {
    const { lessonId, page, limit } = dto;
    const query = this.database
      .selectFrom('lessonAttachment')
      .select(['id', 'url', 'name', 'size', 'type', 'createdAt'])
      .where('lessonId', '=', lessonId)
      .where('deletedAt', 'is', null)
      .orderBy('createdAt', 'desc');

    return paginate(query, { page, limit });
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('lessonAttachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertMultiple(entities: LessonAttachmentEntity[]) {
    return this.database.insertInto('lessonAttachment').values(entities).execute();
  }

  deleteMultipleByIds(ids: number[], actorId: number) {
    return this.database
      .updateTable('lessonAttachment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', 'in', ids)
      .execute();
  }
}
