import * as bcrypt from 'bcryptjs';
import { ConfigService } from '@nestjs/config';
import { DatabaseService } from '../database';
import { ROLE } from '../role/enum/role.enum';

const configService = new ConfigService();

const username = configService.get('ADMIN_USERNAME');
const password = configService.get('ADMIN_PASSWORD');

export async function up(database: DatabaseService): Promise<void> {
  const hashedPassword = await bcrypt.hash(password, 10);

  // Add user
  const { id: userId } = await database
    .insertInto('users')
    .values({
      username,
      password: hashedPassword,
      displayName: 'Admin',
    })
    .returning(['id'])
    .executeTakeFirst();

  // Get admin role
  const { id: roleId } = await database.selectFrom('role').select(['id']).where('name', '=', ROLE.ADMIN).executeTakeFirst();

  // Add role
  await database
    .insertInto('userRole')
    .values({
      userId,
      roleId,
    })
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.deleteFrom('users').where('username', '=', username).execute();
}
