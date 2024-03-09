import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class LevelRepository {
  constructor(private readonly database: DatabaseService) {}

  find() {
    return this.database.selectFrom('level').select(['id', 'name']).execute();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('level')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .executeTakeFirst();
    return Number(count);
  }
}
