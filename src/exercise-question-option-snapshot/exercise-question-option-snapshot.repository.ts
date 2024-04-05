import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { ExerciseQuestionOptionSnapshotEntity } from './exercise-question-option-snapshot.entity';

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

  updateOneByOptionIdWithTransaction(transaction: Transaction, questionOptionId: number, entity: ExerciseQuestionOptionSnapshotEntity) {
    return transaction
      .updateTable('exerciseQuestionOptionSnapshot')
      .set(entity)
      .where('exerciseQuestionOptionSnapshot.deletedAt', 'is', null)
      .where('exerciseQuestionOptionSnapshot.questionOptionId', '=', questionOptionId)
      .execute();
  }

  countByOptionId(optionId: number) {
    return this.database
      .selectFrom('exerciseQuestionOptionSnapshot')
      .where('deletedAt', 'is', null)
      .where('questionOptionId', '=', optionId)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
  }

  insertWithTransaction(transaction: Transaction, entity: ExerciseQuestionOptionSnapshotEntity) {
    return transaction.insertInto('exerciseQuestionOptionSnapshot').values(entity).execute();
  }

  deleteByOptionIdWithTransaction(transaction: Transaction, optionId: number, actorId: number) {
    return transaction
      .updateTable('exerciseQuestionOptionSnapshot')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('questionOptionId', '=', optionId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  getIdByOptionId(optionId: number) {
    return this.database
      .selectFrom('exerciseQuestionOptionSnapshot')
      .where('deletedAt', 'is', null)
      .where('questionOptionId', '=', optionId)
      .select(['id'])
      .executeTakeFirst();
  }

  updateWithTransaction(transaction: Transaction, id: number, entity: ExerciseQuestionOptionSnapshotEntity) {
    return transaction
      .updateTable('exerciseQuestionOptionSnapshot')
      .set(entity)
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .execute();
  }

  deleteByExerciseQuestionSnapshotIdsWithTransaction(transaction: Transaction, exerciseQuestionSnapshotIds: number[]) {
    return transaction
      .deleteFrom('exerciseQuestionOptionSnapshot')
      .where('exerciseQuestionSnapshotId', 'in', exerciseQuestionSnapshotIds)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .execute();
  }

  deleteByOptionIdsWithTransaction(transaction: Transaction, optionIds: number[]) {
    return transaction
      .deleteFrom('exerciseQuestionOptionSnapshot')
      .where('questionOptionId', 'in', optionIds)
      .where('deletedAt', 'is', null)
      .execute();
  }
}
