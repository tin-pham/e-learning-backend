import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService, Transaction } from '../database';

@Injectable()
export class CategoryCourseRepository {
  constructor(private readonly database: DatabaseService) {}

  deleteByCategoryIdAndCourseId(categoryId: number, courseId: number, actorId: number) {
    return this.database
      .updateTable('categoryCourse')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('categoryId', '=', categoryId)
      .where('courseId', '=', courseId)
      .execute();
  }

  async countByCategoryIdAndCourseId(categoryIds: number, courseId: number) {
    const { count } = await this.database
      .selectFrom('categoryCourse')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('categoryId', '=', categoryIds)
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
    return Number(count);
  }

  async updateByCategoryIdsAndCourseIdWithTransaction(transaction: Transaction, categoryIds: number[], courseId: number, actorId: number) {
    if (categoryIds && categoryIds.length) {
      await transaction.deleteFrom('categoryCourse').where('courseId', '=', courseId).execute();
      return transaction
        .insertInto('categoryCourse')
        .columns(['categoryId', 'courseId', 'createdBy'])
        .expression(() =>
          this.database.selectNoFrom(() => [
            sql`unnest(${categoryIds}::int[])`.as('categoryId'),
            sql`${courseId}`.as('courseId'),
            sql`${actorId}`.as('createdBy'),
          ]),
        )
        .onConflict((oc) => oc.doNothing())
        .execute();
    } else {
      return transaction.deleteFrom('categoryCourse').where('courseId', '=', courseId).execute();
    }
  }

  async countByCategoryIdsAndCourseId(categoryIds: number[], courseId: number) {
    const { count } = await this.database
      .selectFrom('categoryCourse')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('categoryId', 'in', categoryIds)
      .where('courseId', '=', courseId)
      .executeTakeFirst();
    return Number(count);
  }

  insertByCategoryIdsAndCourseIdWithTransaction(transaction: Transaction, categoryIds: number[], courseId: number, actorId: number) {
    return transaction
      .insertInto('categoryCourse')
      .columns(['categoryId', 'courseId', 'createdBy'])
      .expression(() =>
        this.database.selectNoFrom(() => [
          sql`unnest(${categoryIds}::int[])`.as('categoryId'),
          sql`${courseId}`.as('courseId'),
          sql`${actorId}`.as('createdBy'),
        ]),
      )
      .execute();
  }

  deleteByCategoryIdsAndCourseIdWithTransaction(transaction: Transaction, categoryIds: number[], courseId: number, actorId: number) {
    return transaction
      .updateTable('categoryCourse')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('categoryId', 'in', categoryIds)
      .where('courseId', '=', courseId)
      .execute();
  }

  deleteByCategoryIdWithTransaction(transaction: Transaction, categoryId: number, actorId: number) {
    return transaction
      .updateTable('categoryCourse')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('categoryId', '=', categoryId)
      .execute();
  }
}
