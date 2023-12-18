import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { PaginateDTO } from '../common/dto/paginate.dto';
import { DatabaseService } from '../database';
import { SubjectEntity } from './subject.entity';

@Injectable()
export class SubjectRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: SubjectEntity) {
    return this.database
      .insertInto('subject')
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  find(filter: PaginateDTO) {
    const query = this.database
      .selectFrom('subject')
      .select(['id', 'name'])
      .where('deletedAt', 'is', null);

    return paginate(query, {
      limit: filter.limit,
      page: filter.page,
    });
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('subject')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
