import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { PostEntity } from './post.entity';
import { PostGetListDTO } from './dto/post.dto';
import { sql } from 'kysely';
import { paginate } from '../common/function/paginate';
import { jsonBuildObject } from 'kysely/helpers/postgres';

@Injectable()
export class PostRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: PostGetListDTO) {
    const { limit, page, courseId } = dto;

    const query = this.database
      .selectFrom('post')
      .where('post.deletedAt', 'is', null)
      .where('post.courseId', '=', courseId)
      .leftJoin('postAttachment', (join) => join.onRef('post.id', '=', 'postAttachment.postId').on('postAttachment.deletedAt', 'is', null))
      .leftJoin('attachment', (join) =>
        join.onRef('attachment.id', '=', 'postAttachment.attachmentId').on('attachment.deletedAt', 'is', null),
      )
      .innerJoin('users', 'users.id', 'post.createdBy')
      .where('users.deletedAt', 'is', null)
      .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'users.id').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))
      .groupBy(['post.id', 'post.courseId', 'users.displayName', 'image.url', 'users.username'])
      .orderBy(['post.updatedAt desc', 'post.createdAt desc'])
      .select(({ fn, ref }) => [
        'post.id',
        'post.content',
        'post.createdBy',
        'post.createdAt',
        'post.updatedAt',
        'users.displayName as createdByDisplayName',
        'users.username as createdByUsername',
        'image.url as createdByImageUrl',
        fn
          .coalesce(
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref('attachment.id'),
                  url: ref('attachment.url'),
                  name: ref('attachment.name'),
                  type: ref('attachment.type'),
                }),
              )
              .filterWhere('attachment.id', 'is not', null),
            sql`'[]'`,
          )
          .as('attachments'),
      ]);

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('post')
      .where('post.id', '=', id)
      .where('post.deletedAt', 'is', null)
      .leftJoin('postAttachment', (join) => join.onRef('post.id', '=', 'postAttachment.postId').on('postAttachment.deletedAt', 'is', null))
      .leftJoin('attachment', (join) =>
        join.onRef('attachment.id', '=', 'postAttachment.attachmentId').on('attachment.deletedAt', 'is', null),
      )
      .innerJoin('users', 'users.id', 'post.createdBy')
      .where('users.deletedAt', 'is', null)
      .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'users.id').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))
      .groupBy(['post.id', 'post.courseId', 'users.displayName', 'image.url'])
      .orderBy(['post.createdAt desc', 'post.updatedAt desc'])
      .groupBy(['post.id', 'post.courseId', 'users.username'])
      .select(({ fn, ref }) => [
        'post.id',
        'post.content',
        'post.createdBy',
        'post.createdAt',
        'post.updatedAt',
        'users.displayName as createdByDisplayName',
        'users.username as createdByUsername',
        'image.url as createdByImageUrl',
        fn
          .coalesce(
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref('attachment.id'),
                  url: ref('attachment.url'),
                  name: ref('attachment.name'),
                  type: ref('attachment.type'),
                }),
              )
              .filterWhere('attachment.id', 'is not', null),
            sql`'[]'`,
          )
          .as('attachments'),
      ])
      .executeTakeFirst();
  }

  update(id: number, entity: PostEntity) {
    return this.database.updateTable('post').set(entity).where('post.id', '=', id).where('post.deletedAt', 'is', null).execute();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('post')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('post.id', '=', id)
      .where('post.deletedAt', 'is', null)
      .execute();
  }

  insertWithTransaction(transaction: Transaction, entity: PostEntity) {
    return transaction.insertInto('post').values(entity).returning(['id', 'courseId']).executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('post')
      .where('id', '=', id)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }
}
