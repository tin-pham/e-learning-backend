import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.CLASSROOM_YEAR;
const { NAME: CLASSROOM_NAME, SCHEMA: CLASSROOM_SCHEMA } =
  DATABASE_TABLE.CLASSROOM;
const { NAME: YEAR_NAME, SCHEMA: YEAR_SCHEMA } = DATABASE_TABLE.YEAR;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.CLASSROOM_ID, 'varchar(50)', (column) =>
      column.references(`${CLASSROOM_NAME}.${CLASSROOM_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.YEAR_ID, 'varchar(50)', (column) =>
      column.references(`${YEAR_NAME}.${YEAR_SCHEMA.ID}`),
    )
    .addPrimaryKeyConstraint('pk_classroom_year', [
      SCHEMA.CLASSROOM_ID,
      SCHEMA.YEAR_ID,
    ])
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
