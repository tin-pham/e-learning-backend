import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ExerciseSubmitEntity } from './exercise-submit.entity';

@Injectable()
export class ExerciseSubmitRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: ExerciseSubmitEntity) {
    return this.database.insertInto('exerciseSubmit').values(entity).returning(['id', 'exerciseId', 'studentId']).executeTakeFirst();
  }
}
