import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(
    transaction: Transaction,
    user: UserEntity,
  ): Promise<UserEntity> {
    return transaction
      .insertInto('users')
      .values({
        username: user.username,
        password: user.password,
        email: user.email,
        phone: user.phone,
        displayName: user.displayName,
      })
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async countByUserName(username: string): Promise<number> {
    const { count } = await this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.username', '=', username)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
    return Number(count);
  }

  async countByEmail(email: string): Promise<number> {
    const { count } = await this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.email', '=', email)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
    return Number(count);
  }

  findOneByUsername(username: string): Promise<UserEntity> {
    return this.database
      .selectFrom('users')
      .selectAll()
      .where('users.username', '=', username)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
  }

  findOneById(id: string): Promise<UserEntity> {
    return this.database
      .selectFrom('users')
      .selectAll()
      .where('users.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
  }
}
