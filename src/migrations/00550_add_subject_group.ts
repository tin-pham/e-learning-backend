import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.SUBJECT_GROUP;
const { NAME: SUBJECT_NAME, SCHEMA: SUBJECT_SCHEMA } = DATABASE_TABLE.SUBJECT;
const { NAME: GROUP_NAME, SCHEMA: GROUP_SCHEMA } = DATABASE_TABLE.GROUP;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.SUBJECT_ID, 'varchar(50)', (column) =>
      column.references(`${SUBJECT_NAME}.${SUBJECT_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.GROUP_ID, 'varchar(50)', (column) =>
      column.references(`${GROUP_NAME}.${GROUP_SCHEMA.ID}`),
    )
    .addPrimaryKeyConstraint('pk_subject_group', [
      SCHEMA.SUBJECT_ID,
      SCHEMA.GROUP_ID,
    ])
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
