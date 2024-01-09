import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.CLASSROOM_YEAR_ASSIGNMENT;
const { NAME: CLASSROOM_YEAR_NAME, SCHEMA: CLASSROOM_YEAR_SCHEMA } = DATABASE_TABLE.CLASSROOM_YEAR;
const { NAME: TEACHER_SUBJECT_NAME, SCHEMA: TEACHER_SUBJECT_SCHEMA } = DATABASE_TABLE.TEACHER_SUBJECT;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.CLASSROOM_YEAR_ID, 'integer', (column) => column.references(`${CLASSROOM_YEAR_NAME}.${CLASSROOM_YEAR_SCHEMA.ID}`))
    .addColumn(SCHEMA.TEACHER_SUBJECT_ID, 'integer', (column) => column.references(`${TEACHER_SUBJECT_NAME}.${TEACHER_SUBJECT_SCHEMA.ID}`))
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
