import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { CourseEntity } from './course.entity';
import { CourseGetListDTO } from './dto/course.dto';

@Injectable()
export class CourseRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: CourseEntity) {
    return this.database.insertInto('course').values(entity).returning(['id', 'name', 'description', 'imageUrl']).executeTakeFirst();
  }

  find(dto: CourseGetListDTO) {
    const { limit, page } = dto;
    const query = this.database
      .selectFrom('course')
      .select(['id', 'name', 'description', 'imageUrl'])
      .where('deletedAt', 'is', null)
      .orderBy('createdAt', 'desc');

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('course')
      .select(['id', 'name', 'description', 'imageUrl'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  update(id: number, entity: CourseEntity) {
    return this.database
      .updateTable('course')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'description', 'imageUrl'])
      .executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('course')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('course')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('course.name', '=', name)
      .where('course.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: number) {
    const { count } = await this.database
      .selectFrom('course')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('course.name', '=', name)
      .where('course.deletedAt', 'is', null)
      .where('course.id', '!=', id)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('course')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('course.id', '=', id)
      .where('course.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
