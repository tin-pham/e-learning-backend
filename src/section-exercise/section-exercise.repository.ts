import { Injectable } from '@nestjs/common';
import { Transaction } from 'src/database';
import { SectionExerciseEntity } from './section-exercise.entity';

@Injectable()
export class SectionExerciseRepository {
  insertWithTransaction(transaction: Transaction, entity: SectionExerciseEntity) {
    return transaction.insertInto('sectionExercise').values(entity).returning(['sectionId']).executeTakeFirst();
  }
}
