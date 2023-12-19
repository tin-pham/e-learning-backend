import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.USER_ROLE;
const { NAME: USERS_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;
const { NAME: ROLES_NAME, SCHEMA: ROLE_SCHEMA } = DATABASE_TABLE.ROLE;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.USER_ID, 'varchar(50)', (column) =>
      column.references(`${USERS_NAME}.${USER_SCHEMA.ID}`).notNull(),
    )
    .addColumn(SCHEMA.ROLE_ID, 'varchar(50)', (column) =>
      column.references(`${ROLES_NAME}.${ROLE_SCHEMA.ID}`).notNull(),
    )
    .addColumn(SCHEMA.CREATED_AT, 'timestamptz', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.CREATED_BY, 'varchar(50)')

    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
