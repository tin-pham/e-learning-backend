import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ExerciseQuestionEntity } from './exercise-question.entity';

@Injectable()
export class ExerciseQuestionRepository {
  constructor(private readonly database: DatabaseService) {}

  getQuestionIdsByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('exerciseQuestion')
      .select('questionId')
      .where('exerciseId', '=', exerciseId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  insertMultiple(entities: ExerciseQuestionEntity[]) {
    return this.database.insertInto('exerciseQuestion').values(entities).execute();
  }

  deleteMultipleByExerciseIdsAndQuestionIds(exerciseIds: number[], questionIds: number[], actorId: number) {
    return this.database
      .updateTable('exerciseQuestion')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('exerciseId', 'in', exerciseIds)
      .where('questionId', 'in', questionIds)
      .where('deletedAt', 'is', null)
      .execute();
  }

  async countByExerciseIdsAndQuestionIds(exerciseIds: number[], questionIds: number[]) {
    const { count } = await this.database
      .selectFrom('exerciseQuestion')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('exerciseId', 'in', exerciseIds)
      .where('questionId', 'in', questionIds)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
