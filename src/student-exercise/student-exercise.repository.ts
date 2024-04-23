import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { StudentExerciseEntity } from './student-exercise.entity';
import { StudentExerciseGetListSubmittedDTO } from './dto/student-exercise.dto';
import { paginate } from '../common/function/paginate';

@Injectable()
export class StudentExerciseRepository {
  constructor(private readonly database: DatabaseService) {}

  getIdByIsSubmittedAndStudentId(isSubmitted: boolean, studentId: string) {
    return this.database
      .selectFrom('studentExercise')
      .where('studentExercise.studentId', '=', studentId)
      .where('studentExercise.isSubmitted', '=', isSubmitted)
      .where('studentExercise.deletedAt', 'is', null)
      .select(['studentExercise.id'])
      .execute();
  }

  findByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('studentExercise')
      .where('studentExercise.exerciseId', '=', exerciseId)
      .where('studentExercise.deletedAt', 'is', null)
      .leftJoin('studentExerciseGrade', (join) =>
        join.onRef('studentExerciseGrade.studentExerciseId', '=', 'studentExercise.id').on('studentExerciseGrade.deletedAt', 'is', null),
      )
      .select([
        'studentExercise.id',
        'studentExercise.studentId',
        'studentExercise.exerciseId',
        'studentExercise.isSubmitted',
        'studentExercise.submittedAt',
        'studentExercise.isLate',
        'studentExerciseGrade.id as studentExerciseGradeId',
      ])
      .execute();
  }

  getIdByExerciseId(exerciseId: number, actorId: number) {
    return this.database
      .selectFrom('studentExercise')
      .select('id')
      .where('exerciseId', '=', exerciseId)
      .where('deletedAt', 'is', null)
      .where('createdBy', '=', actorId)
      .executeTakeFirst();
  }

  find(dto: StudentExerciseGetListSubmittedDTO) {
    const { page, limit, exerciseId } = dto;

    const query = this.database
      .selectFrom('studentExercise')
      .where('studentExercise.exerciseId', '=', exerciseId)
      .where('studentExercise.deletedAt', 'is', null)
      .where('studentExercise.isSubmitted', '=', true)
      .innerJoin('student', 'student.id', 'studentExercise.studentId')
      .innerJoin('users', 'users.id', 'student.userId')
      .where('users.deletedAt', 'is', null)
      .leftJoin('userImage', (join) => join.onRef('users.id', '=', 'userImage.userId').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('userImage.imageId', '=', 'image.id').on('image.deletedAt', 'is', null))
      .leftJoin('studentExerciseGrade', (join) =>
        join.onRef('studentExerciseGrade.studentExerciseId', '=', 'studentExercise.id').on('studentExerciseGrade.deletedAt', 'is', null),
      )
      .select([
        'studentExercise.id',
        'studentExercise.studentId',
        'studentExercise.exerciseId',
        'studentExercise.isSubmitted',
        'studentExercise.submittedAt',
        'studentExercise.isLate',
        'users.displayName as userDisplayName',
        'users.id as userId',
        'users.username as username',
        'image.url as userImageUrl',
        'studentExerciseGrade.point',
        'studentExerciseGrade.totalCount',
        'studentExerciseGrade.correctCount',
      ]);

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('studentExercise')
      .where('studentExercise.id', '=', id)
      .where('studentExercise.deletedAt', 'is', null)
      .innerJoin('exercise', 'exercise.id', 'studentExercise.exerciseId')
      .where('exercise.deletedAt', 'is', null)
      .select([
        'studentExercise.id',
        'studentExercise.studentId',
        'studentExercise.exerciseId',
        'studentExercise.isSubmitted',
        'studentExercise.submittedAt',
        'studentExercise.isLate',
        'exercise.name as exerciseName',
        'exercise.dueDate as exerciseDueDate',
        'exercise.instantMark as exerciseInstantMark',
      ])
      .executeTakeFirst();
  }

  async countByStudentIdAndExerciseId(studentId: string, exerciseId: number) {
    const { count } = await this.database
      .selectFrom('studentExercise')
      .where('studentId', '=', studentId)
      .where('exerciseId', '=', exerciseId)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  updateWithTransaction(transaction: Transaction, id: number, entity: StudentExerciseEntity) {
    return transaction
      .updateTable('studentExercise')
      .set(entity)
      .where('id', '=', id)
      .returning(['id', 'studentId', 'exerciseId', 'isSubmitted', 'submittedAt', 'isLate'])
      .executeTakeFirst();
  }

  insertWithTransaction(transaction: Transaction, entity: StudentExerciseEntity) {
    return transaction.insertInto('studentExercise').values(entity).returning(['id', 'createdAt as startDoingAt']).executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number) {
    return transaction.deleteFrom('studentExercise').where('id', '=', id).where('deletedAt', 'is', null).execute();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('studentExercise')
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  findGradedByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('studentExercise')
      .where('studentExercise.exerciseId', '=', exerciseId)
      .where('studentExercise.deletedAt', 'is', null)
      .innerJoin('studentExerciseGrade', 'studentExerciseGrade.studentExerciseId', 'studentExercise.id')
      .where('studentExerciseGrade.deletedAt', 'is', null)
      .select([
        'studentExercise.id',
        'studentExercise.studentId',
        'studentExercise.exerciseId',
        'studentExercise.isSubmitted',
        'studentExercise.submittedAt',
        'studentExercise.isLate',
        'studentExerciseGrade.id as studentExerciseGradeId',
        //'studentExerciseGrade.basePoint as studentExerciseGradeBasePoint',
      ])
      .execute();
  }
}
