import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { StudentExerciseEntity } from './student-exercise.entity';

@Injectable()
export class StudentExerciseRepository {
  constructor(private readonly database: DatabaseService) {}

  getIdByExerciseId(exerciseId: number) {
    return this.database
      .selectFrom('studentExercise')
      .select('id')
      .where('exerciseId', '=', exerciseId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  findBySubmitted() {
    return this.database
      .selectFrom('studentExercise')
      .where('isSubmitted', '=', true)
      .select(['id', 'studentId', 'exerciseId', 'isSubmitted', 'submittedAt', 'isLate'])
      .execute();
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

  insert(entity: StudentExerciseEntity) {
    return this.database.insertInto('studentExercise').values(entity).returning('id').executeTakeFirst();
  }
}
