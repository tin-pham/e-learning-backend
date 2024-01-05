import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.YEAR_GRADE;
const { NAME: YEAR_NAME, SCHEMA: YEAR_SCHEMA } = DATABASE_TABLE.YEAR;
const { NAME: GRADE_NAME, SCHEMA: GRADE_SCHEMA } = DATABASE_TABLE.GRADE;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.YEAR_ID, 'integer', (column) =>
      column.references(`${YEAR_NAME}.${YEAR_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.GRADE_ID, 'integer', (column) =>
      column.references(`${GRADE_NAME}.${GRADE_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.CREATED_AT, 'timestamptz', (column) =>
      column.defaultTo(sql`now()`),
    )
    .addColumn(SCHEMA.CREATED_BY, 'integer', (column) =>
      column.references(`${USER_NAME}.${USER_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.UPDATED_AT, 'timestamptz')
    .addColumn(SCHEMA.UPDATED_BY, 'integer', (column) =>
      column.references(`${USER_NAME}.${USER_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.DELETED_AT, 'timestamptz')
    .addColumn(SCHEMA.DELETED_BY, 'integer', (column) =>
      column.references(`${USER_NAME}.${USER_SCHEMA.ID}`),
    )
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
