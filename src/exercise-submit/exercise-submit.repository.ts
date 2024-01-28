import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { ExerciseSubmitEntity } from './exercise-submit.entity';
import { ExerciseSubmitGetListDTO } from './dto/exercise-submit.dto';
import { paginate } from '../common/function/paginate';

@Injectable()
export class ExerciseSubmitRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByStudentIdAndExerciseId(studentId: string, exerciseId: number) {
    const { count } = await this.database
      .selectFrom('exerciseSubmit')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('studentId', '=', studentId)
      .where('exerciseId', '=', exerciseId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insertWithTransaction(transaction: Transaction, entity: ExerciseSubmitEntity) {
    return transaction.insertInto('exerciseSubmit').values(entity).returning(['id', 'exerciseId', 'studentId']).executeTakeFirst();
  }

  find(dto: ExerciseSubmitGetListDTO) {
    const { page, limit } = dto;

    const query = this.database.selectFrom('exerciseSubmit').select(['id', 'exerciseId', 'studentId']).where('deletedAt', 'is', null);

    return paginate(query, { page, limit });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('exerciseSubmit')
      .select(['id', 'exerciseId', 'studentId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }
}
