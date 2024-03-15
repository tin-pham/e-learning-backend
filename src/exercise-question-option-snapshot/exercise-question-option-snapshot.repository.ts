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

  getCorrectIdByQuestionId(questionId: number) {
    return this.database
      .selectFrom('exerciseQuestionOptionSnapshot')
      .select(['id'])
      .where('deletedAt', 'is', null)
      .where('questionId', '=', questionId)
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

  insertMultipleByOptionIdsWithTransaction(transaction: Transaction, optionIds: number[]) {
    return transaction
      .with('option_data', (qb) =>
        qb
          .selectFrom('questionOption')
          .where('questionOption.id', 'in', optionIds)
          .where('questionOption.deletedAt', 'is', null)
          .innerJoin('question', 'question.id', 'questionOption.questionId')
          .where('question.deletedAt', 'is', null)
          .innerJoin('exerciseQuestion', 'exerciseQuestion.questionId', 'question.id')
          .where('exerciseQuestion.deletedAt', 'is', null)
          .innerJoin('exercise', 'exercise.id', 'exerciseQuestion.exerciseId')
          .select([
            'questionOption.id as questionOptionId',
            'questionOption.text',
            'questionOption.isCorrect',
            'questionOption.questionId',
            'exercise.id as exerciseId',
          ]),
      )
      .insertInto('exerciseQuestionOptionSnapshot')
      .columns(['questionOptionId', 'text', 'isCorrect', 'questionId', 'exerciseId'])
      .expression((eb) => eb.selectFrom('option_data').select(['questionOptionId', 'text', 'isCorrect', 'questionId', 'exerciseId']))
      .execute();
  }
}
