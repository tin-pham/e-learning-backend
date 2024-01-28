import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { ExerciseSubmitOptionEntity } from './exercise-submit-option.entity';
import { sql } from 'kysely';

export interface IExerciseSubmitOptionInsertMultiple {
  transaction: Transaction;
  questionOptionIds: number[];
  questionId: number;
  exerciseSubmitId: number;
}

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

  getQuestionOptionByExerciseSubmitIdAndQuestionId(exerciseSubmitId: number, questionId: number) {
    return this.database
      .selectFrom('exerciseSubmitOption')
      .select(['questionOptionId'])
      .where('questionId', '=', questionId)
      .where('exerciseSubmitId', '=', exerciseSubmitId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  insert(entity: ExerciseSubmitOptionEntity) {
    return this.database
      .insertInto('exerciseSubmitOption')
      .values(entity)
      .returning(['id', 'questionId', 'questionOptionId', 'exerciseSubmitId'])
      .executeTakeFirst();
  }

  insertMultipleQuestionOptionIdsWithTransaction(data: IExerciseSubmitOptionInsertMultiple) {
    const { transaction, questionOptionIds, questionId, exerciseSubmitId } = data;
    return transaction
      .insertInto('exerciseSubmitOption')
      .columns(['questionOptionId', 'exerciseSubmitId', 'questionId'])
      .expression(() =>
        this.database.selectNoFrom(() => [
          sql`unnest(${questionOptionIds}::int[])`.as('questionOptionId'),
          sql`${exerciseSubmitId}`.as('exerciseSubmitId'),
          sql`${questionId}`.as('questionId'),
        ]),
      )
      .execute();
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
