import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { YearGradeEntity } from './year-grade.entity';

@Injectable()
export class YearGradeRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultipleWithTransaction(transaction: Transaction, entities: YearGradeEntity[]) {
    return transaction.insertInto('yearGrade').values(entities).executeTakeFirstOrThrow();
  }

  deleteMultipleWithTransaction(transaction: Transaction, ids: number[], actorId: number) {
    return transaction
      .updateTable('yearGrade')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', 'in', ids)
      .executeTakeFirstOrThrow();
  }

  getIdsByYearId(id: number) {
    return this.database.selectFrom('yearGrade').select(['id']).where('yearId', '=', id).where('deletedAt', 'is', null).execute();
  }
}
