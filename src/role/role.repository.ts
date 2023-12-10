import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';

@Injectable()
export class RoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async countByIds(ids: string[]) {
    const { count } = await this.databaseService
      .selectFrom('role')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('role.id', 'in', ids)
      .executeTakeFirst();

    return Number(count);
  }

  getAll(): Promise<{ id: string; name: string }[]> {
    return this.databaseService
      .selectFrom('role')
      .select(['id', 'name'])
      .execute();
  }

  getIdByName(name: USER_ROLE): Promise<{ id: string }> {
    return this.databaseService
      .selectFrom('role')
      .select(['id'])
      .where('name', '=', name)
      .executeTakeFirst();
  }
}
