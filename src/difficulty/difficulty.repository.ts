import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class DifficultyRepository {
  constructor(private readonly database: DatabaseService) {}

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('difficulty')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .executeTakeFirst();
    return Number(count);
  }
}
