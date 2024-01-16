import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { LessonEntity } from './lesson.entity';
import { LessonGetListDTO } from './dto/lesson.dto';

@Injectable()
export class LessonRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: LessonEntity) {
    return this.database.insertInto('lesson').values(entity).returningAll().executeTakeFirst();
  }

  find(dto: LessonGetListDTO) {
    const { limit, page } = dto;
    const query = this.database
      .selectFrom('lesson')
      .select(['id', 'title', 'body'])
      .where('lesson.deletedAt', 'is', null)
      .orderBy('lesson.id', 'asc');

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('lesson')
      .select(['id', 'title', 'body'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  update(id: number, entity: LessonEntity) {
    return this.database
      .updateTable('lesson')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'title', 'body'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('lesson')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('lesson')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lesson.id', '=', id)
      .where('lesson.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('lesson')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lesson.id', 'in', ids)
      .where('lesson.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
