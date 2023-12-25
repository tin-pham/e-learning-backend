import { DatabaseService } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';

const roles = Object.values(USER_ROLE);

export async function up(database: DatabaseService): Promise<void> {
  const data = roles.map((role) => ({
    name: role,
  }));
  await database.insertInto('role').values(data).execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.deleteFrom('role').where('name', 'in', roles).execute();
}
