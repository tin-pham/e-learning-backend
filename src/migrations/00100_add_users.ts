import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`uuid_generate_v4()`),
    )
    .addColumn(SCHEMA.USERNAME, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.PASSWORD, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.EMAIL, 'varchar(50)', (column) => column)
    .addColumn(SCHEMA.PHONE, 'varchar(50)', (column) => column)
    .addColumn(SCHEMA.DISPLAY_NAME, 'varchar(50)')
    .addColumn(SCHEMA.CREATED_AT, 'timestamp', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.CREATED_BY, 'varchar(50)', (column) =>
      column.references(`${NAME}.${SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamp')
    .addColumn(SCHEMA.UPDATED_BY, 'varchar(50)', (column) =>
      column.references(`${NAME}.${SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.DELETED_AT, 'timestamp')
    .addColumn(SCHEMA.DELETED_BY, 'varchar(50)', (column) =>
      column.references(`${NAME}.${SCHEMA.ID}`),
    )
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
