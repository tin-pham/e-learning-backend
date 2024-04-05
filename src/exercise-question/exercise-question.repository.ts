import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ExerciseQuestionEntity } from './exercise-question.entity';

@Injectable()
export class ExerciseQuestionRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByExerciseId(exerciseId: number) {
    const { count } = await this.database
      .selectFrom('exerciseQuestion')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('exerciseId', '=', exerciseId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  getQuestionIdsByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('exerciseQuestion')
      .select(['questionId', 'deletedAt'])
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

  findQuestionsByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('exerciseQuestion')
      .where('exerciseQuestion.exerciseId', '=', exerciseId)
      .where('exerciseQuestion.deletedAt', 'is', null)
      .innerJoin('question', 'question.id', 'exerciseQuestion.questionId')
      .where('question.deletedAt', 'is', null)
      .select([
        'question.id as questionId',
        'question.text as questionText',
        'question.difficultyId as questionDifficultyId',
        'question.isMultipleChoice as questionIsMultipleChoice',
        'question.deletedAt as questionDeletedAt',
        'exerciseQuestion.deletedAt',
      ])
      .execute();
  }

  findDeletedByExerciseId(exerciseId: number) {
    return this.database
      .with('last_entries', (qb) =>
        qb
          .selectFrom('exerciseQuestion')
          .select(({ fn }) => ['exerciseId', 'questionId', fn.max('createdAt').as('lastCreationTime')])
          .where('exerciseId', '=', exerciseId)
          .groupBy(['exerciseId', 'questionId']),
      )
      .selectFrom('exerciseQuestion')
      .innerJoin('last_entries', (join) =>
        join
          .onRef('last_entries.exerciseId', '=', 'exerciseQuestion.exerciseId')
          .onRef('last_entries.questionId', '=', 'exerciseQuestion.questionId'),
      )
      .where('exerciseQuestion.deletedAt', 'is not', null)
      .whereRef('exerciseQuestion.createdAt', '=', 'last_entries.lastCreationTime')
      .innerJoin('question', 'question.id', 'exerciseQuestion.questionId')
      .select([
        'question.id as questionId',
        'question.text as questionText',
        'question.difficultyId as questionDifficultyId',
        'question.isMultipleChoice as questionIsMultipleChoice',
        'question.deletedAt as questionDeletedAt',
        'exerciseQuestion.deletedAt',
      ])
      .execute();
  }
}
