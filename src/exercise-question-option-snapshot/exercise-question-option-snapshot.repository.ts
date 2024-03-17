import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';

@Injectable()
export class ExerciseQuestionOptionSnapshotRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('exerciseQuestionOptionSnapshot')
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  getCorrectIdByQuestionId(exerciseQuestionSnapshotId: number) {
    return this.database
      .selectFrom('exerciseQuestionOptionSnapshot')
      .select(['id'])
      .where('deletedAt', 'is', null)
      .where('exerciseQuestionSnapshotId', '=', exerciseQuestionSnapshotId)
      .where('isCorrect', '=', true)
      .execute();
  }

  deleteByExerciseIdWithTransaction(transaction: Transaction, exerciseId: number, actorId: number) {
    return transaction
      .updateTable('exerciseQuestionOptionSnapshot')
      .where('exerciseId', '=', exerciseId)
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .execute();
  }

  async insertMultipleByOptionIdsAndExerciseIdWithTransaction(transaction: Transaction, optionIds: number[], exerciseId: number) {
    const optionData = await transaction
      .selectFrom('questionOption')
      .where('questionOption.id', 'in', optionIds)
      .where('questionOption.deletedAt', 'is', null)
      .innerJoin('question', 'question.id', 'questionOption.questionId')
      .where('question.deletedAt', 'is', null)
      .innerJoin('exerciseQuestionSnapshot', 'exerciseQuestionSnapshot.questionId', 'question.id')
      .where('exerciseQuestionSnapshot.deletedAt', 'is', null)
      .innerJoin('exercise', 'exercise.id', 'exerciseQuestionSnapshot.exerciseId')
      .where('exercise.deletedAt', 'is', null)
      .where('exercise.id', '=', exerciseId)
      .select([
        'questionOption.id as questionOptionId',
        'questionOption.text',
        'questionOption.isCorrect',
        'exerciseQuestionSnapshot.id as exerciseQuestionSnapshotId',
        'exercise.id as exerciseId',
      ])
      .distinctOn(['questionOption.id'])
      .execute();

    return transaction.insertInto('exerciseQuestionOptionSnapshot').values(optionData).execute();
  }
}
