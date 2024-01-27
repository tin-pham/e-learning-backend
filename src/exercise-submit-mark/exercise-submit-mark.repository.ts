import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ExerciseSubmitMarkEntity } from './exercise-submit-mark.entity';

@Injectable()
export class ExerciseSubmitMarkRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: ExerciseSubmitMarkEntity) {
    return this.database
      .insertInto('exerciseSubmitMark')
      .values(entity)
      .returning(['id', 'point', 'correctCount', 'totalCount', 'exerciseSubmitId'])
      .executeTakeFirst();
  }
}
