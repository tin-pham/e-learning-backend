import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class QuestionOptionRepository {
  constructor(private readonly database: DatabaseService) {}

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
