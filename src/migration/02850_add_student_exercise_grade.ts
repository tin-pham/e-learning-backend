import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.STUDENT_EXERCISE_GRADE;
const { NAME: STUDENT_EXERCISE_NAME, SCHEMA: STUDENT_EXERCISE_SCHEMA } = DATABASE_TABLE.STUDENT_EXERCISE;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.POINT, 'decimal(5, 2)', (column) => column.notNull())
    .addColumn(SCHEMA.TOTAL_COUNT, 'integer', (column) => column.notNull())
    .addColumn(SCHEMA.CORRECT_COUNT, 'integer', (column) => column.notNull())
    .addColumn(SCHEMA.STUDENT_EXERCISE, 'integer', (column) =>
      column.notNull().references(`${STUDENT_EXERCISE_NAME}.${STUDENT_EXERCISE_SCHEMA.ID}`),
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
