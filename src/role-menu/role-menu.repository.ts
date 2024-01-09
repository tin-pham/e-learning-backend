import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { RoleMenuEntity } from './role-menu.entity';

@Injectable()
export class RoleMenuRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: RoleMenuEntity[]) {
    return this.database.insertInto('roleMenu').values(entities).execute();
  }

  async countByRoleIdsAndMenuIds(roleIds: number[], menuIds: number[]) {
    const { count } = await this.database
      .selectFrom('roleMenu')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('roleId', 'in', roleIds)
      .where('menuId', 'in', menuIds)
      .executeTakeFirst();
    return Number(count);
  }
}
