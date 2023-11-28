import { Kysely } from 'kysely';
import { UserEntity } from '../user/user.entity';

export interface KyselyTables {
  users: UserEntity;
}

export class DatabaseService extends Kysely<KyselyTables> {}
