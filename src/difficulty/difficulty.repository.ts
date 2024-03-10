import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class DifficultyRepository {
  constructor(private readonly database: DatabaseService) {}

  find() {
    return this.database.selectFrom('difficulty').select(['id', 'name']).where('deletedAt', 'is', null).orderBy('id').execute();
  }

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
