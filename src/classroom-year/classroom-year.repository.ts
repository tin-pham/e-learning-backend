import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { ClassroomYearEntity } from './classroom-year.entity';

@Injectable()
export class ClassroomYearRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultipleWithTransaction(
    transaction: Transaction,
    entities: ClassroomYearEntity[],
  ) {
    return transaction
      .insertInto('classroomYear')
      .values(entities)
      .executeTakeFirstOrThrow();
  }

  deleteMultipleWithTransaction(
    transaction: Transaction,
    ids: string[],
    actorId: string,
  ) {
    return transaction
      .updateTable('classroomYear')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', 'in', ids)
      .executeTakeFirstOrThrow();
  }

  getIdsByYearId(yearId: string) {
    return this.database
      .selectFrom('classroomYear')
      .select(['id'])
      .where('yearId', '=', yearId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  async countByIds(ids: string[]) {
    const { count } = await this.database
      .selectFrom('classroomYear')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .executeTakeFirst();
    return Number(count);
  }
}
