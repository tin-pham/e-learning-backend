import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ExerciseSubmitOptionEntity } from './exercise-submit-option.entity';

@Injectable()
export class ExerciseSubmitOptionRepository {
  constructor(private readonly database: DatabaseService) {}

  findOneByExerciseSubmitIdAndQuestionId(exerciseSubmitId: number, questionId: number) {
    return this.database
      .selectFrom('exerciseSubmitOption')
      .select(['id', 'questionId', 'questionOptionId', 'exerciseSubmitId'])
      .where('questionId', '=', questionId)
      .where('exerciseSubmitId', '=', exerciseSubmitId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  upsert(entity: ExerciseSubmitOptionEntity) {
    return this.database
      .insertInto('exerciseSubmitOption')
      .values(entity)
      .onConflict((oc) => oc.columns(['questionId', 'exerciseSubmitId']).doUpdateSet(entity))
      .returning(['id', 'questionId', 'questionOptionId', 'exerciseSubmitId'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('exerciseSubmitOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
