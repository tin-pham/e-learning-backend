import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ClassroomEntity } from './classroom.entity';
import { ClassroomGetListDTO } from './dto/classroom.dto';
import { paginate } from 'src/common/function/paginate';

@Injectable()
export class ClassroomRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: ClassroomEntity) {
    return this.database
      .insertInto('classroom')
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  find(dto: ClassroomGetListDTO) {
    const query = this.database
      .selectFrom('classroom')
      .select(['id', 'name', 'gradeId'])
      .where('deletedAt', 'is', null);

    return paginate(query, {
      limit: dto.limit,
      page: dto.page,
    });
  }

  update(id: string, entity: ClassroomEntity) {
    return this.database
      .updateTable('classroom')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirst();
  }

  delete(id: string, entity: ClassroomEntity) {
    return this.database
      .updateTable('classroom')
      .set(entity)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('classroom')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: string) {
    const { count } = await this.database
      .selectFrom('classroom')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: string) {
    const { count } = await this.database
      .selectFrom('classroom')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
