import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  store(user: UserEntity) {
    return this.database
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

  countByUserName(username: string): Promise<{ count: number }> {
    return this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.username', '=', username)
      .where('users.deletedAt', 'is', null)
      .$narrowType<{ count: number }>()
      .executeTakeFirstOrThrow();
  }

  countByEmail(email: string): Promise<{ count: number }> {
    return this.database
      .selectFrom('users')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('users.email', '=', email)
      .where('users.deletedAt', 'is', null)
      .$narrowType<{ count: number }>()
      .executeTakeFirstOrThrow();
  }
}
