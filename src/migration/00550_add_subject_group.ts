import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.SUBJECT_GROUP;
const { NAME: SUBJECT_NAME, SCHEMA: SUBJECT_SCHEMA } = DATABASE_TABLE.SUBJECT;
const { NAME: GROUP_NAME, SCHEMA: GROUP_SCHEMA } = DATABASE_TABLE.GROUP;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.SUBJECT_ID, 'integer', (column) => column.references(`${SUBJECT_NAME}.${SUBJECT_SCHEMA.ID}`))
    .addColumn(SCHEMA.GROUP_ID, 'integer', (column) => column.references(`${GROUP_NAME}.${GROUP_SCHEMA.ID}`))
    .addColumn(SCHEMA.CREATED_AT, 'timestamptz', (column) => column.defaultTo(sql`now()`))
    .addColumn(SCHEMA.CREATED_BY, 'integer', (column) => column.references(`${USER_NAME}.${USER_SCHEMA.ID}`))
    .addColumn(SCHEMA.UPDATED_AT, 'timestamptz')
    .addColumn(SCHEMA.UPDATED_BY, 'integer', (column) => column.references(`${USER_NAME}.${USER_SCHEMA.ID}`))
    .addColumn(SCHEMA.DELETED_AT, 'timestamptz')
    .addColumn(SCHEMA.DELETED_BY, 'integer', (column) => column.references(`${USER_NAME}.${USER_SCHEMA.ID}`))
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
