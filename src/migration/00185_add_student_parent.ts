import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.STUDENT_PARENT;
const { NAME: STUDENT_NAME, SCHEMA: STUDENT_SCHEMA } = DATABASE_TABLE.STUDENT;
const { NAME: PARENT_NAME, SCHEMA: PARENT_SCHEMA } = DATABASE_TABLE.PARENT;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.STUDENT_ID, 'varchar(50)', (column) =>
      column.references(`${STUDENT_NAME}.${STUDENT_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.PARENT_ID, 'varchar(50)', (column) =>
      column.references(`${PARENT_NAME}.${PARENT_SCHEMA.ID}`),
    )
    .addPrimaryKeyConstraint('pk_student_parent', [
      SCHEMA.STUDENT_ID,
      SCHEMA.PARENT_ID,
    ])
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
