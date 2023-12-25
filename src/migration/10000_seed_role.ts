import { DatabaseService } from '../database';
import { ROLE } from '../role/enum/role.enum';

const roles = Object.values(ROLE);

export async function up(database: DatabaseService): Promise<void> {
  const data = roles.map((role) => ({
    name: role,
  }));
  await database.insertInto('role').values(data).execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.deleteFrom('role').where('name', 'in', roles).execute();
}
