import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { UserEntity } from './user.entity';
import { ROLE } from '../role/enum/role.enum';
import { paginate } from '../common/function/paginate';
import { PaginateDTO } from '../common/dto/paginate.dto';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: UserEntity): Promise<UserEntity> {
    return transaction.insertInto('users').values(entity).returningAll().executeTakeFirstOrThrow();
  }

  async countByUserName(username: string): Promise<number> {
    const { count } = await this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.username', '=', username)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByEmail(email: string): Promise<number> {
    const { count } = await this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.email', '=', email)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByPhone(phone: string): Promise<number> {
    const { count } = await this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.phone', '=', phone)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByEmailExceptId(email: string, id: number): Promise<number> {
    const { count } = await this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.email', '=', email)
      .where('users.id', '!=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByPhoneExceptId(phone: string, id: number): Promise<number> {
    const { count } = await this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.phone', '=', phone)
      .where('users.id', '!=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  findOneByUsername(username: string): Promise<UserEntity> {
    return this.database
      .selectFrom('users')
      .selectAll()
      .where('users.username', '=', username)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  findOneById(id: number): Promise<UserEntity> {
    return this.database.selectFrom('users').selectAll().where('users.id', '=', id).where('users.deletedAt', 'is', null).executeTakeFirst();
  }

  findByRole(filter: PaginateDTO, role: ROLE) {
    const query = this.database
      .selectFrom('users')
      .innerJoin('userRole', 'users.id', 'userRole.userId')
      .innerJoin('role', 'userRole.roleId', 'role.id')
      .selectAll('users')
      .where('role.name', '=', role)
      .where('users.deletedAt', 'is', null);

    return paginate(query, {
      limit: filter.limit,
      page: filter.page,
    });
  }

  updateWithTransaction(transaction: Transaction, id: number, entity: UserEntity) {
    return transaction
      .updateTable('users')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  deleteWithTransaction(transaction: Transaction, id: number, entity: UserEntity) {
    return transaction
      .updateTable('users')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirstOrThrow();
  }
}
