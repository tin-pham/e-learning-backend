import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { ClassroomYearEntity } from './classroom-year.entity';

@Injectable()
export class ClassroomYearRepository {
  insertMultipleWithTransaction(
    transaction: Transaction,
    entities: ClassroomYearEntity[],
  ) {
    return transaction
      .insertInto('classroomYear')
      .values(entities)
      .executeTakeFirstOrThrow();
  }
}
