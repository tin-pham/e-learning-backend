import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.ATTACHMENT;
const { NAME: ASSIGNMENT_NAME, SCHEMA: ASSIGNMENT_SCHEMA } = DATABASE_TABLE.ASSIGNMENT;
const { NAME: LESSON_NAME, SCHEMA: LESSON_SCHEMA } = DATABASE_TABLE.LESSON;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.URL, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.NAME, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.SIZE, 'varchar(25)', (column) => column.notNull())
    .addColumn(SCHEMA.TYPE, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.ASSIGNMENT_ID, 'integer', (column) => column.references(`${ASSIGNMENT_NAME}.${ASSIGNMENT_SCHEMA.ID}`))
    .addColumn(SCHEMA.LESSON_ID, 'integer', (column) => column.references(`${LESSON_NAME}.${LESSON_SCHEMA.ID}`))
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
