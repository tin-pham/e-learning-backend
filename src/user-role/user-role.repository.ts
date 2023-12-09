import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { UserRoleEntiy } from './user-role.entity';
import { RoleEntity } from '../role/role.entity';

@Injectable()
export class UserRoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  insertMultipleWithTransaction(
    transaction: Transaction,
    entities: UserRoleEntiy[],
  ) {
    return transaction
      .insertInto('userRole')
      .values(entities)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  findRolesByUserId(userId: string): Promise<RoleEntity[]> {
    return this.databaseService
      .selectFrom('userRole')
      .innerJoin('role', 'role.id', 'userRole.roleId')
      .selectAll('role')
      .where('userRole.userId', '=', userId)
      .execute();
  }
}
