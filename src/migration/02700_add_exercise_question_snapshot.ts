import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.EXERCISE_QUESTION_SNAPSHOT;
const { NAME: QUESTION_NAME, SCHEMA: QUESTION_SCHEMA } = DATABASE_TABLE.QUESTION;
const { NAME: EXERCISE_NAME, SCHEMA: EXERCISE_SCHEMA } = DATABASE_TABLE.EXERCISE;
const { NAME: DIFFICULTY_NAME, SCHEMA: DIFFICULTY_SCHEMA } = DATABASE_TABLE.DIFFICULTY;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.TEXT, 'varchar(255)', (column) => column.notNull())
    .addColumn(SCHEMA.DIFFICULTY_ID, 'integer', (column) => column.notNull().references(`${DIFFICULTY_NAME}.${DIFFICULTY_SCHEMA.ID}`))
    .addColumn(SCHEMA.IS_MULTIPLE_CHOICE, 'boolean', (column) => column.notNull())
    .addColumn(SCHEMA.QUESTION_ID, 'integer', (column) => column.notNull().references(`${QUESTION_NAME}.${QUESTION_SCHEMA.ID}`))
    .addColumn(SCHEMA.EXERCISE_ID, 'integer', (column) => column.notNull().references(`${EXERCISE_NAME}.${EXERCISE_SCHEMA.ID}`))
    .addColumn(SCHEMA.CAPTURED_AT, 'timestamptz')
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
