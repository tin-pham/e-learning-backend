import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.STUDENT;
const { NAME: USERS_TABLE, SCHEMA: USER_SCHEMA } = DATABASE_TABLE.USERS;
const { NAME: PARENTS_TABLE, SCHEMA: PARENT_SCHEMA } = DATABASE_TABLE.PARENT;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.ID, 'varchar(50)', (column) =>
      column.primaryKey().defaultTo(sql`generate_student_id()`),
    )
    .addColumn(SCHEMA.USER_ID, 'varchar(50)', (column) =>
      column.references(`${USERS_TABLE}.${USER_SCHEMA.ID}`).notNull(),
    )
    .addColumn(SCHEMA.PARENT_ID, 'varchar(50)', (column) =>
      column.references(`${PARENTS_TABLE}.${PARENT_SCHEMA.ID}`),
    )
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
