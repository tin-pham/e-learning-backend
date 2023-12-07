import { Kysely } from 'kysely';
import { UserEntity } from '../user/user.entity';
import { RoleEntity } from '../role/role.entity';
import { UserRoleEntiy } from '../user-role/user-role.entity';

export interface KyselyTables {
  users: UserEntity;
  role: RoleEntity;
  user_role: UserRoleEntiy;
}

export class DatabaseService extends Kysely<KyselyTables> {}
