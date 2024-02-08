import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService, Transaction } from 'src/database';

@Injectable()
export class CategoryCourseRepository {
  constructor(private readonly database: DatabaseService) {}

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
