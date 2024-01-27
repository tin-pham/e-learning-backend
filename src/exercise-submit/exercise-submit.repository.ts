import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ExerciseSubmitEntity } from './exercise-submit.entity';
import { ExerciseSubmitGetListDTO } from './dto/exercise-submit.dto';
import { paginate } from '../common/function/paginate';

@Injectable()
export class ExerciseSubmitRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByStudentId(studentId: string) {
    const { count } = await this.database
      .selectFrom('exerciseSubmit')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('studentId', '=', studentId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('exerciseSubmit')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insert(entity: ExerciseSubmitEntity) {
    return this.database
      .insertInto('exerciseSubmit')
      .values(entity)
      .returning(['id', 'exerciseId', 'isSubmit', 'studentId'])
      .executeTakeFirst();
  }

  find(dto: ExerciseSubmitGetListDTO) {
    const { page, limit } = dto;

    const query = this.database
      .selectFrom('exerciseSubmit')
      .select(['id', 'exerciseId', 'isSubmit', 'studentId'])
      .where('deletedAt', 'is', null);

    return paginate(query, { page, limit });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('exerciseSubmit')
      .select(['id', 'exerciseId', 'isSubmit', 'studentId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  update(id: number, entity: ExerciseSubmitEntity) {
    return this.database
      .updateTable('exerciseSubmit')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'isSubmit'])
      .executeTakeFirst();
  }
}
