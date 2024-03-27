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

  async countByStudentExerciseId(studentExerciseId: number) {
    const { count } = await this.database
      .selectFrom('studentExerciseGrade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('studentExerciseId', '=', studentExerciseId)
      .where('deletedAt', 'is', null)
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
}
