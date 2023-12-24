import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { GradeEntity } from './grade.entity';
import { DatabaseService } from '../database/database.service';
import { GradeGetListDTO } from './dto/grade.dto';

@Injectable()
export class GradeRepository {
  constructor(private readonly database: DatabaseService) {}

  store(entity: GradeEntity) {
    return this.database
      .insertInto('grade')
      .values(entity)
      .returning(['id', 'name'])
      .executeTakeFirstOrThrow();
  }

  find(dto: GradeGetListDTO) {
    const query = this.database
      .selectFrom('grade')
      .select(['id', 'name'])
      .where('deletedAt', 'is', null);

    return paginate(query, {
      limit: dto.limit,
      page: dto.page,
    });
  }

  update(id: string, entity: GradeEntity) {
    return this.database
      .updateTable('grade')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  delete(entity: GradeEntity) {
    return this.database
      .updateTable('grade')
      .set(entity)
      .where('id', '=', entity.id)
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

  async countByNameExceptId(name: string, id: string) {
    const { count } = await this.database
      .selectFrom('grade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: string) {
    const { count } = await this.database
      .selectFrom('grade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
