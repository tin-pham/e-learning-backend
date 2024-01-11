import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { QuestionOptionEntity } from './question-option.entity';
import { QuestionOptionGetListDTO } from './dto/question-option.dto';

@Injectable()
export class QuestionOptionRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: QuestionOptionGetListDTO) {
    const { page, limit } = dto;

    const query = this.database
      .selectFrom('questionOption')
      .select(['id', 'text', 'questionId'])
      .where('deletedAt', 'is', null)
      .orderBy('id', 'asc');

    return paginate(query, {
      page,
      limit,
    });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('questionOption')
      .select(['id', 'text', 'questionId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  insert(entity: QuestionOptionEntity) {
    return this.database.insertInto('questionOption').values(entity).returning(['id', 'text', 'questionId']).executeTakeFirst();
  }

  update(id: number, entity: QuestionOptionEntity) {
    return this.database
      .updateTable('questionOption')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'questionId'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('questionOption')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'questionId'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('questionOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  getQuestionIdById(id: number) {
    return this.database
      .selectFrom('questionOption')
      .select(['questionId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }
}
