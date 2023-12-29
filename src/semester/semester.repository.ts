import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { SemesterEntity } from './semester.entity';

@Injectable()
export class SemesterRepository {
  constructor(private readonly database: DatabaseService) {}
  insertMultipleWithTransaction(
    transaction: Transaction,
    entities: SemesterEntity[],
  ) {
    return transaction
      .insertInto('semester')
      .values(entities)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  getIdsByYearId(yearId: string) {
    return this.database
      .selectFrom('semester')
      .select(['id'])
      .where('yearId', '=', yearId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  deleteMultipleWithTransaction(
    transaction: Transaction,
    ids: string[],
    actorId: string,
  ) {
    return transaction
      .updateTable('semester')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
  }
}
