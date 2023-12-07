import { Kysely, sql } from 'kysely';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.USER_ROLE;
const { SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;
const { SCHEMA: ROLE_SCHEMA } = DATABASE_TABLE.ROLE;

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.USER_ID, 'varchar(50)', (column) =>
      column.references(USER_SCHEMA.ID).notNull(),
    )
    .addColumn(SCHEMA.ROLE_ID, 'varchar(50)', (column) =>
      column.references(ROLE_SCHEMA.ID).notNull(),
    )
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .execute();
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
