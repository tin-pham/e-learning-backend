import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';

@Injectable()
export class RoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async countByIds(ids: string[]) {
    const { count } = await this.databaseService
      .selectFrom('role')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('role.id', 'in', ids)
      .where('role.deletedAt', 'is', null)
      .executeTakeFirst();

    return Number(count);
  }

  getAll(): Promise<{ id: string; name: string }[]> {
    return this.databaseService
      .selectFrom('role')
      .select(['id', 'name'])
      .where('deletedAt', 'is', null)
      .execute();
  }
}
