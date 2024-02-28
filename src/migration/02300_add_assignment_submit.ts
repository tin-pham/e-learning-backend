import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.ASSIGNMENT_SUBMIT;
const { NAME: ASSIGNMENT_NAME, SCHEMA: ASSIGNMENT_SCHEMA } = DATABASE_TABLE.ASSIGNMENT;
const { NAME: STUDENT_NAME, SCHEMA: STUDENT_SCHEMA } = DATABASE_TABLE.STUDENT;
const { NAME: ATTACHMENT_NAME, SCHEMA: ATTACHMENT_SCHEMA } = DATABASE_TABLE.ATTACHMENT;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.ASSIGNMENT_ID, 'integer', (column) => column.notNull().references(`${ASSIGNMENT_NAME}.${ASSIGNMENT_SCHEMA.ID}`))
    .addColumn(SCHEMA.STUDENT_ID, 'varchar(50)', (column) => column.notNull().references(`${STUDENT_NAME}.${STUDENT_SCHEMA.ID}`))
    .addColumn(SCHEMA.ATTACHMENT_ID, 'integer', (column) => column.notNull().references(`${ATTACHMENT_NAME}.${ATTACHMENT_SCHEMA.ID}`))
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
