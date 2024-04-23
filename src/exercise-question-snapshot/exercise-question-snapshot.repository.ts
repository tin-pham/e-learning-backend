import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService, Transaction } from '../database';
import { paginate } from '../common/function/paginate';
import { ExerciseQuestionSnapshotGetListDTO } from './dto/exercise-question-snapshot.dto';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { ExerciseQuestionSnapshotEntity } from './exercise-question-snapshot.entity';

@Injectable()
export class ExerciseQuestionSnapshotRepository {
  constructor(private readonly database: DatabaseService) {}

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('exerciseQuestionSnapshot')
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  findWithoutOption(dto: ExerciseQuestionSnapshotGetListDTO, studentExerciseId: number) {
    const { page, limit } = dto;

    const query = this.database
      .selectFrom('exerciseQuestionSnapshot')
      .where('exerciseQuestionSnapshot.deletedAt', 'is', null)
      .innerJoin('difficulty', 'difficulty.id', 'exerciseQuestionSnapshot.difficultyId')
      .where('difficulty.deletedAt', 'is', null)
      .innerJoin('exercise', 'exercise.id', 'exerciseQuestionSnapshot.exerciseId')
      .where('exercise.deletedAt', 'is', null)
      .innerJoin('studentExercise', 'studentExercise.exerciseId', 'exercise.id')
      .where('studentExercise.deletedAt', 'is', null)
      .where('studentExercise.id', '=', studentExerciseId)
      .innerJoin(
        'exerciseQuestionOptionSnapshot',
        'exerciseQuestionOptionSnapshot.exerciseQuestionSnapshotId',
        'exerciseQuestionSnapshot.id',
      )
      .where('exerciseQuestionOptionSnapshot.deletedAt', 'is', null)
      .groupBy([
        'exerciseQuestionSnapshot.id',
        'exerciseQuestionSnapshot.text',
        'exerciseQuestionSnapshot.difficultyId',
        'difficulty.name',
        'exerciseQuestionSnapshot.isMultipleChoice',
        'exerciseQuestionSnapshot.exerciseId',
      ])
      .select(({ fn, ref }) => [
        'exerciseQuestionSnapshot.id',
        'exerciseQuestionSnapshot.text',
        'exerciseQuestionSnapshot.difficultyId',
        'difficulty.name as diffulltyName',
        'exerciseQuestionSnapshot.isMultipleChoice',
        fn
          .coalesce(
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref('exerciseQuestionOptionSnapshot.id'),
                  text: ref('exerciseQuestionOptionSnapshot.text'),
                }),
              )
              .filterWhere('exerciseQuestionOptionSnapshot.id', 'is not', null),
            sql`'[]'`,
          )
          .as('options'),
      ]);

    return paginate(query, {
      page,
      limit,
    });
  }

  find(dto: ExerciseQuestionSnapshotGetListDTO) {
    const { page, limit, exerciseId } = dto;

    const query = this.database
      .selectFrom('exerciseQuestionSnapshot')
      .where('exerciseQuestionSnapshot.deletedAt', 'is', null)
      .innerJoin('exercise', 'exercise.id', 'exerciseQuestionSnapshot.exerciseId')
      .where('exercise.deletedAt', 'is', null)
      .where('exercise.id', '=', exerciseId)
      .innerJoin('difficulty', 'difficulty.id', 'exerciseQuestionSnapshot.difficultyId')
      .where('difficulty.deletedAt', 'is', null)
      .innerJoin(
        'exerciseQuestionOptionSnapshot',
        'exerciseQuestionOptionSnapshot.exerciseQuestionSnapshotId',
        'exerciseQuestionSnapshot.id',
      )
      .where('exerciseQuestionOptionSnapshot.deletedAt', 'is', null)
      .select(({ fn, ref }) => [
        'exerciseQuestionSnapshot.questionId as id',
        'exerciseQuestionSnapshot.text',
        'exerciseQuestionSnapshot.difficultyId',
        'difficulty.name as diffulltyName',
        'exerciseQuestionSnapshot.isMultipleChoice',
        fn
          .coalesce(
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref('exerciseQuestionOptionSnapshot.id'),
                  text: ref('exerciseQuestionOptionSnapshot.text'),
                  isCorrect: ref('exerciseQuestionOptionSnapshot.isCorrect'),
                }),
              )
              .filterWhere('exerciseQuestionOptionSnapshot.id', 'is not', null),
            sql`'[]'`,
          )
          .as('options'),
      ])
      .groupBy([
        'exerciseQuestionSnapshot.id',
        'exerciseQuestionSnapshot.text',
        'exerciseQuestionSnapshot.difficultyId',
        'difficulty.name',
        'exerciseQuestionSnapshot.isMultipleChoice',
      ]);

    return paginate(query, {
      page,
      limit,
    });
  }

  findByStudentExerciseId(dto: ExerciseQuestionSnapshotGetListDTO, studentExerciseId: number, actorId: number) {
    const { page, limit } = dto;

    const query = this.database
      .selectFrom('exerciseQuestionSnapshot')
      .where('exerciseQuestionSnapshot.deletedAt', 'is', null)
      .innerJoin('exercise', 'exercise.id', 'exerciseQuestionSnapshot.exerciseId')
      .where('exercise.deletedAt', 'is', null)
      .innerJoin('difficulty', 'difficulty.id', 'exerciseQuestionSnapshot.difficultyId')
      .where('difficulty.deletedAt', 'is', null)
      .innerJoin(
        'exerciseQuestionOptionSnapshot',
        'exerciseQuestionOptionSnapshot.exerciseQuestionSnapshotId',
        'exerciseQuestionSnapshot.id',
      )
      .where('exerciseQuestionOptionSnapshot.deletedAt', 'is', null)
      .innerJoin('studentExercise', 'studentExercise.exerciseId', 'exercise.id')
      .where('studentExercise.deletedAt', 'is', null)
      .where('studentExercise.id', '=', studentExerciseId)
      .leftJoin('studentExerciseOption', (join) =>
        join
          .onRef('studentExerciseOption.questionOptionSnapshotId', '=', 'exerciseQuestionOptionSnapshot.id')
          .on('studentExerciseOption.deletedAt', 'is', null)
          .on('studentExerciseOption.createdBy', '=', actorId),
      )
      .select(({ fn, ref }) => [
        'exerciseQuestionSnapshot.id',
        'exerciseQuestionSnapshot.text',
        'exerciseQuestionSnapshot.difficultyId',
        'difficulty.name as diffulltyName',
        'exerciseQuestionSnapshot.isMultipleChoice',
        fn
          .coalesce(
            fn
              .jsonAgg(
                jsonBuildObject({
                  id: ref('exerciseQuestionOptionSnapshot.id'),
                  text: ref('exerciseQuestionOptionSnapshot.text'),
                  isCorrect: ref('exerciseQuestionOptionSnapshot.isCorrect'),
                  isChosen: ref('studentExerciseOption.id'),
                }),
              )
              .filterWhere('exerciseQuestionOptionSnapshot.id', 'is not', null),
            sql`'[]'`,
          )
          .as('options'),
      ])
      .groupBy([
        'exerciseQuestionSnapshot.id',
        'exerciseQuestionSnapshot.text',
        'exerciseQuestionSnapshot.difficultyId',
        'difficulty.name',
        'exerciseQuestionSnapshot.isMultipleChoice',
      ]);

    return paginate(query, {
      page,
      limit,
    });
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('exerciseQuestionSnapshot')
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  getIdsByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('exerciseQuestionSnapshot')
      .select(['id'])
      .where('exerciseId', '=', exerciseId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  deleteByExerciseIdWithTransaction(transaction: Transaction, exerciseId: number, actorId: number) {
    return transaction
      .updateTable('exerciseQuestionSnapshot')
      .where('exerciseId', '=', exerciseId)
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .execute();
  }

  async insertMultipleByQuestionIdsAndExerciseIdWithTransaction(transaction: Transaction, questionIds: number[], exerciseId: number) {
    // return transaction
    //   .with('question_data', (qb) =>
    //     qb
    //       .selectFrom('question')
    //       .select(['text', 'difficultyId', 'isMultipleChoice', 'id'])
    //       .where('id', 'in', questionIds)
    //       .where('deletedAt', 'is', null),
    //   )
    //   .insertInto('exerciseQuestionSnapshot')
    //   .columns(['questionId', 'text', 'difficultyId', 'isMultipleChoice', 'exerciseId'])
    //   .expression((eb) =>
    //     eb
    //       .selectFrom('question_data')
    //       .select(({ ref }) => [
    //         ref('id').as('questionId'),
    //         ref('text').as('text'),
    //         ref('difficultyId').as('difficultyId'),
    //         ref('isMultipleChoice').as('isMultipleChoice'),
    //         sql`${exerciseId}`.as('exerciseId'),
    //       ]),
    //   )
    //   .execute();

    const questionData = await transaction
      .selectFrom('question')
      .select(['text', 'difficultyId', 'isMultipleChoice', 'id'])
      .where('id', 'in', questionIds)
      .where('deletedAt', 'is', null)
      .execute();

    return transaction
      .insertInto('exerciseQuestionSnapshot')
      .values(
        questionData.map((question) => ({
          questionId: question.id,
          text: question.text,
          difficultyId: question.difficultyId,
          isMultipleChoice: question.isMultipleChoice,
          exerciseId,
        })),
      )
      .returning(['id'])
      .execute();
  }

  getIdByQuestionId(questionId: number) {
    return this.database
      .selectFrom('exerciseQuestionSnapshot')
      .select(['id'])
      .where('questionId', '=', questionId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  deleteByQuestionIdWithTransaction(transaction: Transaction, questionId: number, actorId: number) {
    return transaction
      .updateTable('exerciseQuestionSnapshot')
      .where('questionId', '=', questionId)
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .execute();
  }

  updateWithTransaction(transaction: Transaction, id: number, data: Partial<ExerciseQuestionSnapshotEntity>) {
    return transaction.updateTable('exerciseQuestionSnapshot').set(data).where('id', '=', id).where('deletedAt', 'is', null).execute();
  }

  insertWithTransaction(transaction: Transaction, data: Partial<ExerciseQuestionSnapshotEntity>) {
    return transaction.insertInto('exerciseQuestionSnapshot').values(data).returning(['id']).executeTakeFirst();
  }

  deleteByQuestionIdsWithTransaction(transaction: Transaction, questionIds: number[]) {
    return transaction.deleteFrom('exerciseQuestionSnapshot').where('questionId', 'in', questionIds).returning(['id']).execute();
  }
}
