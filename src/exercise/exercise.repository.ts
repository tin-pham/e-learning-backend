import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { ExerciseEntity } from './exercise.entity';
import { ExerciseGetDetailDTO, ExerciseGetListDTO } from './dto/exercise.dto';
import { paginate } from '../common/function/paginate';

@Injectable()
export class ExerciseRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: ExerciseEntity) {
    return transaction
      .insertInto('exercise')
      .values(entity)
      .returning(['id', 'name', 'difficultyId', 'dueDate', 'time'])
      .executeTakeFirst();
  }

  find(dto: ExerciseGetListDTO, userId: number) {
    const { limit, page, lessonId, isActive, includeGrade, isSubmitted, isMissing, isLate } = dto;

    console.log(dto);

    const withLesson = Boolean(lessonId);

    const query = this.database
      .selectFrom('exercise')
      .where('exercise.deletedAt', 'is', null)
      .innerJoin('difficulty', 'difficulty.id', 'exercise.difficultyId')
      .where('difficulty.deletedAt', 'is', null)
      .leftJoin('studentExercise', (join) =>
        join
          .onRef('studentExercise.exerciseId', '=', 'exercise.id')
          .on('studentExercise.deletedAt', 'is', null)
          .on('studentExercise.createdBy', '=', userId),
      )
      .select([
        'exercise.id',
        'exercise.name',
        'exercise.difficultyId',
        'difficulty.name as difficultyName',
        'exercise.isActive',
        'exercise.activatedAt',
        'exercise.dueDate',
        'exercise.time',
        'studentExercise.id as studentExerciseId',
        'studentExercise.id as isStartDoing',
        'studentExercise.createdAt as startDoingAt',
        'studentExercise.isSubmitted',
        'studentExercise.submittedAt as submissionDate',
        'studentExercise.isLate as isSubmissionLate',
      ])
      .$if(withLesson, (qb) =>
        qb
          .innerJoin('lessonExercise', 'lessonExercise.exerciseId', 'exercise.id')
          .where('lessonExercise.deletedAt', 'is', null)
          .innerJoin('lesson', 'lesson.id', 'lessonExercise.lessonId')
          .where('lesson.id', '=', dto.lessonId)
          .where('lesson.deletedAt', 'is', null),
      )
      .$if(isActive !== undefined, (qb) => qb.where('exercise.isActive', '=', isActive))
      .$if(includeGrade, (qb) =>
        qb
          .leftJoin('studentExerciseGrade', (join) =>
            join
              .onRef('studentExerciseGrade.studentExerciseId', '=', 'studentExercise.id')
              .on('studentExerciseGrade.deletedAt', 'is', null),
          )
          .select([
            'studentExerciseGrade.point',
            'studentExerciseGrade.id as studentExerciseGradeId',
            'studentExerciseGrade.totalCount',
            'studentExerciseGrade.correctCount',
          ]),
      )
      .$if(isSubmitted !== undefined, (qb) => qb.where('studentExercise.isSubmitted', '=', isSubmitted))
      .$if(isLate !== undefined, (qb) => qb.where('studentExercise.isLate', '=', isLate))
      .$if(isMissing !== undefined, (qb) => qb.where('studentExercise.id', 'is', null));
    return paginate(query, { limit, page });
  }

  updateWithTransaction(transaction: Transaction, id: number, entity: ExerciseEntity) {
    return transaction
      .updateTable('exercise')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'isActive', 'activatedAt', 'difficultyId', 'dueDate', 'time'])
      .executeTakeFirst();
  }

  async getNameById(id: number) {
    return this.database
      .selectFrom('exercise')
      .where('exercise.deletedAt', 'is', null)
      .where('exercise.id', '=', id)
      .select(['name'])
      .executeTakeFirst();
  }

  async findOneById(id: number, dto?: ExerciseGetDetailDTO) {
    return this.database
      .selectFrom('exercise')
      .where('exercise.deletedAt', 'is', null)
      .where('exercise.id', '=', id)
      .innerJoin('difficulty', 'difficulty.id', 'exercise.difficultyId')
      .where('difficulty.deletedAt', 'is', null)
      .leftJoin('studentExercise', (join) =>
        join.onRef('studentExercise.exerciseId', '=', 'exercise.id').on('studentExercise.deletedAt', 'is', null),
      )
      .leftJoin('student', (join) => join.onRef('student.id', '=', 'studentExercise.studentId'))
      .leftJoin('users', (join) => join.onRef('users.id', '=', 'student.userId').on('users.deletedAt', 'is', null))
      .select([
        'exercise.id',
        'exercise.name',
        'exercise.difficultyId',
        'difficulty.name as difficultyName',
        'exercise.isActive',
        'exercise.activatedAt',
        'exercise.dueDate',
        'exercise.time',
        'exercise.instantMark',
        'studentExercise.studentId',
        'studentExercise.id as studentExerciseId',
        'studentExercise.id as isStartDoing',
        'studentExercise.createdAt as startDoingAt',
        'studentExercise.isSubmitted',
        'studentExercise.submittedAt as submissionDate',
        'studentExercise.isLate as isSubmissionLate',
      ])
      .$if(dto?.includeGrade, (qb) =>
        qb
          .leftJoin('studentExerciseGrade', (join) =>
            join
              .onRef('studentExerciseGrade.studentExerciseId', '=', 'studentExercise.id')
              .on('studentExerciseGrade.deletedAt', 'is', null),
          )
          .select([
            'studentExerciseGrade.id as studentExerciseGradeId',
            'studentExerciseGrade.id as isGraded',
            'studentExerciseGrade.point',
            'studentExerciseGrade.correctCount',
            'studentExerciseGrade.totalCount',
          ]),
      )
      .executeTakeFirst();
    // return this.database
    //   .with('exercise_data', (qb) =>
    //     qb
    //       .selectFrom('exercise')
    //       .leftJoin('exerciseQuestion', (join) =>
    //         join.onRef('exerciseQuestion.exerciseId', '=', 'exercise.id').on('exerciseQuestion.deletedAt', 'is', null),
    //       )
    //       .leftJoin('question', (join) =>
    //         join.onRef('question.id', '=', 'exerciseQuestion.questionId').on('question.deletedAt', 'is', null),
    //       )
    //       .where('exercise.deletedAt', 'is', null)
    //       .select(['exercise.id', 'exercise.name', 'exercise.difficultyId', 'question.id as question_id']),
    //   )
    //   .with('question_data', (qb) =>
    //     qb
    //       .selectFrom('question')
    //       .leftJoin('questionOption', (join) =>
    //         join.onRef('questionOption.questionId', '=', 'question.id').on('questionOption.deletedAt', 'is', null),
    //       )
    //       .where('question.deletedAt', 'is', null)
    //       .groupBy(['question.id', 'question.text'])
    //       .select(({ fn, ref }) => [
    //         'question.id',
    //         'question.text',
    //         fn
    //           .coalesce(
    //             fn
    //               .jsonAgg(
    //                 jsonBuildObject({
    //                   id: ref('questionOption.id'),
    //                   text: ref('questionOption.text'),
    //                   isCorrect: ref('questionOption.isCorrect'),
    //                 }),
    //               )
    //               .filterWhere('questionOption.id', 'is not', null),
    //             sql`'[]'`,
    //           )
    //           .as('options'),
    //       ]),
    //   )
    //   .selectFrom('exercise_data')
    //   .innerJoin('difficulty', 'difficulty.id', 'exercise_data.difficultyId')
    //   .leftJoin('question_data', 'question_data.id', 'exercise_data.question_id')
    //   .where('exercise_data.id', '=', id)
    //   .groupBy(['exercise_data.id', 'exercise_data.name', 'difficulty.id'])
    //   .select(({ fn, ref }) => [
    //     'exercise_data.id',
    //     'exercise_data.name',
    //     jsonBuildObject({ id: ref('difficulty.id'), name: ref('difficulty.name') }).as('difficulty'),
    //     fn
    //       .coalesce(
    //         fn
    //           .jsonAgg(
    //             jsonBuildObject({
    //               id: ref('question_data.id'),
    //               text: ref('question_data.text'),
    //               options: ref('question_data.options'),
    //             }),
    //           )
    //           .filterWhere('question_data.id', 'is not', null),
    //         sql`'[]'`,
    //       )
    //       .as('questions'),
    //   ])
    //   .executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('exercise')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('exercise')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('exercise')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
