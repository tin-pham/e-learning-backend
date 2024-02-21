import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { LessonCommentEntity } from './lesson-comment.entity';
import { LessonCommentGetListDTO } from './dto/lesson-comment.dto';
import { jsonBuildObject } from 'kysely/helpers/postgres';

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
      .with('userData', (qb) =>
        qb
          .selectFrom('lessonComment')
          .innerJoin('users', 'lessonComment.createdBy', 'users.id')
          .where('users.deletedAt', 'is', null)
          .leftJoin('attachment', (join) => join.onRef('attachment.id', '=', 'users.imageId').on('attachment.deletedAt', 'is', null))
          .where('lessonComment.lessonId', '=', lessonId)
          .where('lessonComment.deletedAt', 'is', null)
          .select(({ ref }) => [
            'users.id',
            'users.displayName',
            'users.email',
            'users.username',
            'users.phone',
            jsonBuildObject({
              url: ref('attachment.url'),
            }).as('image'),
          ]),
      )
      .selectFrom('lessonComment')
      .innerJoin('userData', 'userData.id', 'lessonComment.createdBy')
      .select(({ ref }) => [
        'lessonComment.id',
        'lessonComment.lessonId',
        'lessonComment.body',
        'lessonComment.parentId',
        'lessonComment.createdAt',
        'lessonComment.createdBy',
        jsonBuildObject({
          id: ref('userData.id'),
          displayName: ref('userData.displayName'),
          email: ref('userData.email'),
          username: ref('userData.username'),
          phone: ref('userData.phone'),
          image: ref('userData.image'),
        }).as('createdByUser'),
      ])
      .where('lessonComment.deletedAt', 'is', null);

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
