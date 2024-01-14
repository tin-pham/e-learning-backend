import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ExerciseEntity } from './exercise.entity';
import { ExerciseGetListDTO } from './dto/exercise.dto';
import { paginate } from '../common/function/paginate';

@Injectable()
export class ExerciseRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: ExerciseEntity) {
    return this.database.insertInto('exercise').values(entity).returning(['id', 'name']).executeTakeFirst();
  }

  find(dto: ExerciseGetListDTO) {
    const { limit, page } = dto;
    const query = this.database.selectFrom('exercise').select(['id', 'name']).where('deletedAt', 'is', null);

    return paginate(query, { limit, page });
  }

  update(id: number, entity: ExerciseEntity) {
    return this.database
      .updateTable('exercise')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name'])
      .executeTakeFirst();
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('exercise')
      .select(['id', 'name'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
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
