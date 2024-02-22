import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { LessonCommentEntity } from './lesson-comment.entity';
import { LessonCommentGetListDTO } from './dto/lesson-comment.dto';
import { sql } from 'kysely';

@Injectable()
export class LessonCommentRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: LessonCommentEntity, actorId: number) {
    return this.database
      .with('commentData', (eb) =>
        eb
          .insertInto('lessonComment')
          .values({
            ...entity,
            createdAt: new Date(),
            createdBy: actorId,
          })
          .returning(['id', 'lessonId', 'body', 'parentId', 'createdAt', 'createdBy']),
      )
      .selectFrom('commentData')
      .innerJoin('users', 'users.id', 'commentData.createdBy')
      .where('users.deletedAt', 'is', null)
      .leftJoin('attachment', (join) => join.onRef('attachment.id', '=', 'users.imageId').on('attachment.deletedAt', 'is', null))
      .select([
        'commentData.id',
        'commentData.lessonId',
        'commentData.body',
        'commentData.parentId',
        'commentData.createdAt',
        'commentData.createdBy',
        'users.id as userId',
        'users.displayName as userDisplayName',
        'attachment.url as userImageUrl',
      ])
      .executeTakeFirst();
  }

  find(dto: LessonCommentGetListDTO) {
    const { page, limit, lessonId, commentId } = dto;

    const byComment = Boolean(commentId);

    // const query = this.database
    //   .with('userData', (qb) =>
    //     qb
    //       .selectFrom('lessonComment')
    //       .innerJoin('users', 'lessonComment.createdBy', 'users.id')
    //       .where('users.deletedAt', 'is', null)
    //       .leftJoin('attachment', (join) => join.onRef('attachment.id', '=', 'users.imageId').on('attachment.deletedAt', 'is', null))
    //       .where('lessonComment.lessonId', '=', lessonId)
    //       .where('lessonComment.deletedAt', 'is', null)
    //       .select(({ ref }) => [
    //         'users.id',
    //         'users.displayName',
    //         'users.email',
    //         'users.username',
    //         'users.phone',
    //         jsonBuildObject({
    //           url: ref('attachment.url'),
    //         }).as('image'),
    //       ]),
    //   )
    //   .selectFrom('lessonComment')
    //   .innerJoin('userData', 'userData.id', 'lessonComment.createdBy')
    //   .select(({ ref }) => [
    //     'lessonComment.id',
    //     'lessonComment.lessonId',
    //     'lessonComment.body',
    //     'lessonComment.parentId',
    //     'lessonComment.createdAt',
    //     'lessonComment.createdBy',
    //     jsonBuildObject({
    //       id: ref('userData.id'),
    //       displayName: ref('userData.displayName'),
    //       email: ref('userData.email'),
    //       username: ref('userData.username'),
    //       phone: ref('userData.phone'),
    //       image: ref('userData.image'),
    //     }).as('createdByUser'),
    //   ])
    //   .where('lessonComment.deletedAt', 'is', null);

    const query = this.database
      .withRecursive('commentTree', (qb) =>
        qb
          .selectFrom('lessonComment')
          .where('lessonComment.lessonId', '=', lessonId)
          .where('lessonComment.parentId', 'is', null)
          .where('lessonComment.deletedAt', 'is', null)
          .$if(byComment, (eb) => eb.where('lessonComment.id', '=', commentId))
          .innerJoin('users', 'lessonComment.createdBy', 'users.id')
          .leftJoin('attachment', (join) => join.onRef('attachment.id', '=', 'users.imageId').on('attachment.deletedAt', 'is', null))
          .where('users.deletedAt', 'is', null)
          .select([
            'lessonComment.id',
            'lessonComment.lessonId',
            'lessonComment.body',
            'lessonComment.parentId',
            'lessonComment.createdAt',
            'lessonComment.createdBy',
            'users.id as userId',
            'users.displayName as userDisplayName',
            'attachment.url as userImageUrl',
            sql`0`.as('depth'),
          ])
          .unionAll((eb) =>
            eb
              .selectFrom('commentTree')
              .innerJoin('lessonComment', 'lessonComment.parentId', 'commentTree.id')
              .where('lessonComment.deletedAt', 'is', null)
              .innerJoin('users', 'lessonComment.createdBy', 'users.id')
              .leftJoin('attachment', (join) => join.onRef('attachment.id', '=', 'users.imageId').on('attachment.deletedAt', 'is', null))
              .where('users.deletedAt', 'is', null)
              .select([
                'lessonComment.id',
                'lessonComment.lessonId',
                'lessonComment.body',
                'lessonComment.parentId',
                'lessonComment.createdAt',
                'lessonComment.createdBy',
                'users.id as userId',
                'users.displayName as userDisplayName',
                'attachment.url as userImageUrl',
                sql`comment_tree.depth + 1`.as('depth'),
              ]),
          ),
      )
      .selectFrom('commentTree')
      .selectAll()
      .orderBy('createdAt', 'desc');

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
      .withRecursive('commentTree', (qb) =>
        qb
          .selectFrom('lessonComment')
          .select('lessonComment.id')
          .where('lessonComment.id', '=', id)
          .where('deletedAt', 'is', null)
          .unionAll((eb) =>
            eb.selectFrom('commentTree').innerJoin('lessonComment', 'lessonComment.parentId', 'commentTree.id').select('lessonComment.id'),
          ),
      )
      .updateTable('lessonComment')
      .where(({ selectFrom, eb }) => eb('id', 'in', selectFrom('commentTree').select(['id']).where('deletedAt', 'is', null)))
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
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
