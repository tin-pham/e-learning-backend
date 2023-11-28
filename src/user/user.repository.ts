import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database';
import { UserEntity } from './user.entity';

@Injectable()
export class UserRepository {
  constructor(private readonly database: DatabaseService) {}

  findByUsername(username: string): Promise<UserEntity> {
    return this.database
      .selectFrom('users')
      .selectAll()
      .where('users.username', '=', username)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
  }
}
