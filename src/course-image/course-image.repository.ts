import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { CourseImageEntity } from './course-image.entity';

@Injectable()
export class CourseImageRepository {
  constructor(private readonly database: DatabaseService) {}
  deleteByCourseIdWithTransaction(transaction: Transaction, courseId: number, actorId: number) {
    return transaction
      .updateTable('courseImage')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .returning(['id', 'imageId', 'courseId'])
      .executeTakeFirst();
  }

  insertWithTransaction(transaction: Transaction, entity: CourseImageEntity) {
    return transaction.insertInto('courseImage').values(entity).returning(['id', 'imageId', 'courseId']).executeTakeFirst();
  }

  async countByCourseId(courseId: number) {
    const { count } = await this.database
      .selectFrom('courseImage')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
