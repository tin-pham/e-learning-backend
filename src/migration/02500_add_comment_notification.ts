import { sql } from 'kysely';
import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.COMMENT_NOTIFICATION;
const { NAME: COMMENT_NAME, SCHEMA: COMMENT_SCHEMA } = DATABASE_TABLE.LESSON_COMMENT;
const { NAME: NOTIFICATION_NAME, SCHEMA: NOTIFICATION_SCHEMA } = DATABASE_TABLE.NOTIFICATION;
const { NAME: USER_NAME, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'serial', (column) => column.primaryKey())
    .addColumn(SCHEMA.COMMENT_ID, 'integer', (column) => column.notNull().references(`${COMMENT_NAME}.${COMMENT_SCHEMA.ID}`))
    .addColumn(SCHEMA.NOTIFICATION_ID, 'integer', (column) => column.notNull().references(`${NOTIFICATION_NAME}.${NOTIFICATION_SCHEMA.ID}`))
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
