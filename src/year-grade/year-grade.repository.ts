import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { YearGradeEntity } from './year-grade.entity';

@Injectable()
export class YearGradeRepository {
  insertMultipleWithTransaction(
    transaction: Transaction,
    entities: YearGradeEntity[],
  ) {
    return transaction
      .insertInto('yearGrade')
      .values(entities)
      .executeTakeFirstOrThrow();
  }
}
