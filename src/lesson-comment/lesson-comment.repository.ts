import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { LessonCommentEntity } from './lesson-comment.entity';
import { LessonCommentGetListDTO } from './dto/lesson-comment.dto';
import { sql } from 'kysely';

@Injectable()
export class LessonCommentRepository {
  constructor(private readonly database: DatabaseService) {}

  getCreatedByById(id: number) {
    return this.database
      .selectFrom('lessonComment')
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .select(['createdBy'])
      .executeTakeFirst();
  }

  getUserIdById(id: number) {
    return this.database
      .selectFrom('lessonComment')
      .where('lessonComment.deletedAt', 'is', null)
      .where('lessonComment.id', '=', id)
      .innerJoin('users', 'users.id', 'lessonComment.createdBy')
      .where('users.deletedAt', 'is', null)
      .select(['users.id as userId'])
      .executeTakeFirst();
  }

  insertWithTransaction(transaction: Transaction, entity: LessonCommentEntity, actorId: number) {
    return transaction
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
      .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'users.id').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))

      .select([
        'commentData.id',
        'commentData.lessonId',
        'commentData.body',
        'commentData.parentId',
        'commentData.createdAt',
        'commentData.createdBy',
        'users.id as userId',
        'users.displayName as userDisplayName',
        'image.url as userImageUrl',
      ])
      .executeTakeFirst();
  }

  find(dto: LessonCommentGetListDTO) {
    const { page, limit, lessonId, commentId } = dto;

    const byComment = Boolean(commentId);
    const byLesson = Boolean(lessonId);

    const query = this.database
      .withRecursive('commentTree', (qb) =>
        qb
          .selectFrom('lessonComment')
          .where('lessonComment.deletedAt', 'is', null)
          .$if(!byComment, (eb) => eb.where('lessonComment.parentId', 'is', null))
          .$if(byLesson, (eb) => eb.where('lessonComment.lessonId', '=', lessonId))
          .$if(byComment, (eb) => eb.where('lessonComment.id', '=', commentId))
          .innerJoin('users', 'lessonComment.createdBy', 'users.id')
          .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'users.id').on('userImage.deletedAt', 'is', null))
          .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))
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
            'image.url as userImageUrl',
            sql`0`.as('depth'),
          ])
          .unionAll((eb) =>
            eb
              .selectFrom('commentTree')
              .innerJoin('lessonComment', 'lessonComment.parentId', 'commentTree.id')
              .where('lessonComment.deletedAt', 'is', null)
              .innerJoin('users', 'lessonComment.createdBy', 'users.id')
              .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'users.id').on('userImage.deletedAt', 'is', null))
              .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))
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
                'image.url as userImageUrl',
                sql`comment_tree.depth + 1`.as('depth'),
              ]),
          ),
      )
      .selectFrom('commentTree')
      .selectAll();

    if (byComment) {
      query.orderBy('depth');
    } else {
      query.orderBy('createdAt');
    }

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    // return this.database
    //   .selectFrom('lessonComment')
    //   .select(['id', 'lessonId', 'body', 'parentId', 'createdBy'])
    //   .where('id', '=', id)
    //   .where('deletedAt', 'is', null)
    //   .executeTakeFirst();
    return this.database
      .withRecursive('commentTree', (qb) =>
        qb
          .selectFrom('lessonComment')
          .where('lessonComment.id', '=', id)
          .where('lessonComment.deletedAt', 'is', null)
          .innerJoin('users', 'lessonComment.createdBy', 'users.id')
          .where('users.deletedAt', 'is', null)
          .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'users.id').on('userImage.deletedAt', 'is', null))
          .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))
          .select([
            'lessonComment.id',
            'lessonComment.lessonId',
            'lessonComment.body',
            'lessonComment.parentId',
            'lessonComment.createdAt',
            'lessonComment.createdBy',
            'users.id as userId',
            'users.displayName as userDisplayName',
            'image.url as userImageUrl',
          ])
          .unionAll((eb) =>
            eb
              .selectFrom('commentTree')
              .innerJoin('lessonComment', 'lessonComment.parentId', 'commentTree.id')
              .where('lessonComment.deletedAt', 'is', null)
              .innerJoin('users', 'lessonComment.createdBy', 'users.id')
              .where('users.deletedAt', 'is', null)
              .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'users.id').on('userImage.deletedAt', 'is', null))
              .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))
              .select([
                'lessonComment.id',
                'lessonComment.lessonId',
                'lessonComment.body',
                'lessonComment.parentId',
                'lessonComment.createdAt',
                'lessonComment.createdBy',
                'users.id as userId',
                'users.displayName as userDisplayName',
                'image.url as userImageUrl',
              ]),
          ),
      )
      .selectFrom('commentTree')
      .selectAll()
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

  async countByIdAndCreatedBy(id: number, createdBy: number) {
    const { count } = await this.database
      .selectFrom('lessonComment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lessonComment.id', '=', id)
      .where('lessonComment.createdBy', '=', createdBy)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
