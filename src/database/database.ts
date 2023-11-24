import { Kysely } from 'kysely';
import { UserEntity } from '../user';

export interface KyselyTables {
  users: UserEntity;
}

export class DatabaseService extends Kysely<KyselyTables> {}
