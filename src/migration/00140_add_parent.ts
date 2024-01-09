import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.PARENT;
const { NAME: USERS_TABLE, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) => column.primaryKey().defaultTo(sql`generate_parent_id()`))
    .addColumn(SCHEMA.USER_ID, 'integer', (column) => column.references(`${USERS_TABLE}.${USER_SCHEMA.ID}`).notNull())
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
