import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ROLE } from '../role/enum/role.enum';

@Injectable()
export class RoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  async countByIds(ids: number[]) {
    const { count } = await this.databaseService
      .selectFrom('role')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('role.id', 'in', ids)
      .executeTakeFirst();

    return Number(count);
  }

  getAll(): Promise<{ id: number; name: string }[]> {
    return this.databaseService
      .selectFrom('role')
      .select(['id', 'name'])
      .execute();
  }

  getIdByName(name: ROLE): Promise<{ id: number }> {
    return this.databaseService
      .selectFrom('role')
      .select(['id'])
      .where('name', '=', name)
      .executeTakeFirst();
  }
}
