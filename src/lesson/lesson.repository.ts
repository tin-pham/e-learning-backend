import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class LessonRepository {
  constructor(private readonly database: DatabaseService) {}

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('lesson')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lesson.id', 'in', ids)
      .where('lesson.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
