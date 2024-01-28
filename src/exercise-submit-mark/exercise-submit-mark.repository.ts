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

  deleteById(id: number, actorId: number) {
    return this.database
      .updateTable('exerciseSubmitMark')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countByExerciseSubmitId(exerciseSubmitId: number) {
    const { count } = await this.database
      .selectFrom('exerciseSubmitMark')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('exerciseSubmitId', '=', exerciseSubmitId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('exerciseSubmitMark')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
