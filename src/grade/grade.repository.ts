import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { GradeEntity } from './grade.entity';
import { DatabaseService, Transaction } from '../database/database.service';
import { GradeGetListDTO } from './dto/grade.dto';

@Injectable()
export class GradeRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: GradeEntity) {
    return this.database
      .insertInto('grade')
      .values(entity)
      .returning(['id', 'name'])
      .executeTakeFirstOrThrow();
  }

  insertMultipleWithTransaction(
    transction: Transaction,
    entities: GradeEntity[],
  ): Promise<GradeEntity[]> {
    return transction
      .insertInto('grade')
      .values(entities)
      .returningAll()
      .execute();
  }

  find(dto: GradeGetListDTO) {
    const { limit, page } = dto;

    const query = this.database
      .selectFrom('grade')
      .select(['id', 'name'])
      .where('deletedAt', 'is', null);

    return paginate(query, {
      limit,
      page,
    });
  }

  update(id: number, entity: GradeEntity) {
    return this.database
      .updateTable('grade')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  delete(id: number, entity: GradeEntity) {
    return this.database
      .updateTable('grade')
      .set(entity)
      .where('id', '=', id)
      .executeTakeFirstOrThrow();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('grade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: number) {
    const { count } = await this.database
      .selectFrom('grade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('grade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  getIds() {
    return this.database
      .selectFrom('grade')
      .select(['id'])
      .where('deletedAt', 'is', null)
      .execute();
  }
}
