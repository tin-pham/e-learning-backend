import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class QuestionRepository {
  constructor(private readonly database: DatabaseService) {}

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('question')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
