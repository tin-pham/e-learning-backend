import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.TEACHER_SUBJECT;
const { NAME: TEACHER_NAME, SCHEMA: TEACHER_YEAR } = DATABASE_TABLE.TEACHER;
const { NAME: SUBJECT_NAME, SCHEMA: SUBJECT_SCHEMA } = DATABASE_TABLE.SUBJECT;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.TEACHER_ID, 'varchar(50)', (column) => column.references(`${TEACHER_NAME}.${TEACHER_YEAR.ID}`))
    .addColumn(SCHEMA.SUBJECT_ID, 'integer', (column) => column.references(`${SUBJECT_NAME}.${SUBJECT_SCHEMA.ID}`))
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
