import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { StudentExerciseGradeEntity } from './student-exercise-grade.entity';

@Injectable()
export class StudentExerciseGradeRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: StudentExerciseGradeEntity) {
    return this.database
      .insertInto('studentExerciseGrade')
      .values(entity)
      .returning(['id', 'point', 'correctCount', 'totalCount', 'studentExerciseId'])
      .executeTakeFirst();
  }

  insertWithTransaciton(transaction: Transaction, entity: StudentExerciseGradeEntity) {
    return transaction
      .insertInto('studentExerciseGrade')
      .values(entity)
      .returning(['id', 'point', 'correctCount', 'totalCount', 'studentExerciseId'])
      .executeTakeFirst();
  }

  deleteById(id: number, actorId: number) {
    return this.database
      .updateTable('studentExerciseGrade')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countByStudentExerciseId(studentExerciseId: number, actorId: number) {
    const { count } = await this.database
      .selectFrom('studentExerciseGrade')
      .where('studentExerciseGrade.studentExerciseId', '=', studentExerciseId)
      .where('studentExerciseGrade.deletedAt', 'is', null)
      .innerJoin('studentExercise', 'studentExercise.id', 'studentExerciseGrade.studentExerciseId')
      .where('studentExercise.deletedAt', 'is', null)
      .where('studentExercise.createdBy', '=', actorId)
      .select(({ fn }) => fn.count('studentExerciseGrade.id').as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('studentExerciseGrade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  deleteByStudentExerciseIdWithTransaction(transaction: Transaction, studentExerciseId: number) {
    return transaction
      .deleteFrom('studentExerciseGrade')
      .where('studentExerciseId', '=', studentExerciseId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  deleteWithTransaction(transaction: Transaction, id: number) {
    return transaction.deleteFrom('studentExerciseGrade').where('id', '=', id).where('deletedAt', 'is', null).execute();
  }
}
