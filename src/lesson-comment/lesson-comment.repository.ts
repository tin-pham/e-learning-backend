import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { LessonCommentEntity } from './lesson-comment.entity';
import { LessonCommentGetListDTO } from './dto/lesson-comment.dto';

@Injectable()
export class LessonCommentRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: LessonCommentEntity, actorId: number) {
    return this.database
      .insertInto('lessonComment')
      .values({
        ...entity,
        createdAt: new Date(),
        createdBy: actorId,
      })
      .returning(['id', 'lessonId', 'body', 'parentId', 'createdBy'])
      .executeTakeFirst();
  }

  find(dto: LessonCommentGetListDTO) {
    const { page, limit, lessonId } = dto;
    const query = this.database
      .selectFrom('lessonComment')
      .select(['id', 'lessonId', 'body', 'parentId', 'createdBy'])
      .where('lessonId', '=', lessonId)
      .where('deletedAt', 'is', null);

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('lessonComment')
      .select(['id', 'lessonId', 'body', 'parentId', 'createdBy'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  update(id: number, entity: LessonCommentEntity, actorId: number) {
    return this.database
      .updateTable('lessonComment')
      .set({
        ...entity,
        updatedAt: new Date(),
        updatedBy: actorId,
      })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'body'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('lessonComment')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', '=', id)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('lessonComment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lessonComment.id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
