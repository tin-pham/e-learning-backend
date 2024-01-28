import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.EXERCISE_SUBMIT_OPTION;
const { NAME: EXERCISE_SUBMIT_NAME, SCHEMA: EXERCISE_SUBMIT_SCHEMA } = DATABASE_TABLE.EXERCISE_SUBMIT;
const { NAME: QUESTION_NAME, SCHEMA: QUESTION_SCHEMA } = DATABASE_TABLE.QUESTION;
const { NAME: QUESTION_OPTION_NAME, SCHEMA: QUESTION_OPTION_SCHEMA } = DATABASE_TABLE.QUESTION_OPTION;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.QUESTION_ID, 'integer', (column) => column.notNull().references(`${QUESTION_NAME}.${QUESTION_SCHEMA.ID}`))
    .addColumn(SCHEMA.EXERCISE_SUBMIT_ID, 'integer', (column) =>
      column.notNull().references(`${EXERCISE_SUBMIT_NAME}.${EXERCISE_SUBMIT_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.QUESTION_OPTION_ID, 'integer', (column) =>
      column.notNull().references(`${QUESTION_OPTION_NAME}.${QUESTION_OPTION_SCHEMA.ID}`),
    )
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
