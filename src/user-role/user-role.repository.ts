import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { UserRoleEntity } from './user-role.entity';
import { RoleEntity } from '../role/role.entity';

@Injectable()
export class UserRoleRepository {
  constructor(private readonly databaseService: DatabaseService) {}

  insertMultipleWithTransaction(
    transaction: Transaction,
    entities: UserRoleEntity[],
  ) {
    return transaction
      .insertInto('userRole')
      .values(entities)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  findRolesByUserId(userId: number): Promise<RoleEntity[]> {
    return this.databaseService
      .selectFrom('userRole')
      .innerJoin('role', 'role.id', 'userRole.roleId')
      .selectAll('role')
      .where('userRole.userId', '=', userId)
      .where('userRole.deletedAt', 'is', null)
      .execute();
  }

  insertWithTransaction(transaction: Transaction, entity: UserRoleEntity) {
    return transaction
      .insertInto('userRole')
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  deleteWithTransaction(transaction: Transaction, entity: UserRoleEntity) {
    return transaction
      .deleteFrom('userRole')
      .where('userId', '=', entity.userId)
      .where('roleId', '=', entity.roleId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  deleteMultipleByUserIdWithTransaction(
    transaction: Transaction,
    userId: number,
    actorId: number,
  ) {
    return transaction
      .updateTable('userRole')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('userId', '=', userId)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
