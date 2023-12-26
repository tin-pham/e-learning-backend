import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { SemesterEntity } from './semester.entity';

@Injectable()
export class SemesterRepository {
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
}
