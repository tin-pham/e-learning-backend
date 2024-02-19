import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { AttachmentEntity } from './attachment.entity';
import { AttachmentGetListDTO } from './dto/attachment.dto';

@Injectable()
export class AttachmentRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: AttachmentGetListDTO) {
    const { lessonId, page, limit, assignmentId } = dto;

    const withLesson = Boolean(lessonId);
    const withAssignment = Boolean(assignmentId);

    const query = this.database
      .selectFrom('attachment')
      .select(['attachment.id', 'attachment.url', 'attachment.name', 'attachment.size', 'attachment.type', 'attachment.createdAt'])
      .where('attachment.deletedAt', 'is', null)
      .orderBy('attachment.createdAt', 'desc')
      .$if(withLesson, (q) =>
        q.innerJoin('lesson', 'lesson.id', 'attachment.lessonId').where('lesson.deletedAt', 'is', null).where('lesson.id', '=', lessonId),
      )
      .$if(withAssignment, (q) =>
        q
          .innerJoin('assignment', 'assignment.id', 'attachment.assignmentId')
          .where('assignment.deletedAt', 'is', null)
          .where('assignment.id', '=', assignmentId),
      );

    return paginate(query, { page, limit });
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('attachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertMultiple(entities: AttachmentEntity[]) {
    return this.database.insertInto('attachment').values(entities).execute();
  }

  deleteMultipleByIds(ids: number[], actorId: number) {
    return this.database.updateTable('attachment').set({ deletedAt: new Date(), deletedBy: actorId }).where('id', 'in', ids).execute();
  }
}
