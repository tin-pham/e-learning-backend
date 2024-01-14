import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { QuestionEntity } from './question.entity';
import { QuestionGetListDTO } from './dto/question.dto';

@Injectable()
export class QuestionRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: QuestionGetListDTO) {
    const { page, limit } = dto;

    const query = this.database
      .selectFrom('question')
      .select(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .where('deletedAt', 'is', null)
      .orderBy('id', 'asc');

    return paginate(query, {
      page,
      limit,
    });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('question')
      .select(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  insert(entity: QuestionEntity) {
    return this.database
      .insertInto('question')
      .values(entity)
      .returning(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .executeTakeFirst();
  }

  update(id: number, entity: QuestionEntity) {
    return this.database
      .updateTable('question')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('question')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'text', 'difficultyId', 'isMultipleChoice'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('question')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('question')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
