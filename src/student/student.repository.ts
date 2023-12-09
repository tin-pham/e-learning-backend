import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { StudentEntity } from './student.entity';

@Injectable()
export class StudentRepository {
  storeWithTransaction(transaction: Transaction, entity: StudentEntity) {
    return transaction
      .insertInto('student')
      .values(entity)
      .executeTakeFirstOrThrow();
  }
}
