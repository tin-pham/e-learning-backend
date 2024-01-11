import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { AnswerEntity } from './answer.entity';

@Injectable()
export class AnswerRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: AnswerEntity) {
    return this.database.insertInto('answer').values(entity).returningAll().executeTakeFirstOrThrow();
  }

  update(id: number, entity: AnswerEntity) {
    return this.database
      .updateTable('answer')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'questionOptionId'])
      .executeTakeFirstOrThrow();
  }

  findOneByQuestionId(questionId: number) {
    return this.database
      .selectFrom('answer')
      .select(['id', 'questionId', 'questionOptionId'])
      .where('questionId', '=', questionId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('answer')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirstOrThrow();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('answer')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
