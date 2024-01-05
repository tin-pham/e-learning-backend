import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { SubjectEntity } from './subject.entity';
import { SubjectGetListDTO } from './dto/subject.dto';

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

  find(dto: SubjectGetListDTO) {
    const withGroup = Boolean(dto.groupId);

    const query = this.database
      .selectFrom('subject')
      .select(['subject.id', 'subject.name'])
      .where('subject.deletedAt', 'is', null)
      .$if(withGroup, (query) =>
        query
          .innerJoin('subjectGroup', 'subjectGroup.subjectId', 'subject.id')
          .innerJoin('group', 'group.id', 'subjectGroup.groupId')
          .where('subjectGroup.groupId', '=', dto.groupId)
          .where('group.deletedAt', 'is', null),
      );

    return paginate(query, {
      limit: dto.limit,
      page: dto.page,
    });
  }

  update(id: number, entity: SubjectEntity) {
    return this.database
      .updateTable('subject')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('subject')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('subject')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
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

  async countByNameExceptId(name: string, id: number) {
    const { count } = await this.database
      .selectFrom('subject')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .where('id', '!=', id)
      .executeTakeFirst();
    return Number(count);
  }
}
