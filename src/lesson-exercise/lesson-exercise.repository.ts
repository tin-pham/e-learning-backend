import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { LessonExerciseEntity } from './lesson-exercise.entity';

@Injectable()
export class LessonExerciseRepository {
  insertWithTransaction(transaction: Transaction, entity: LessonExerciseEntity) {
    return transaction.insertInto('lessonExercise').values(entity).returning(['lessonId']).executeTakeFirst();
  }
}
