import { DatabaseService } from '../database';
import { DATABASE_TABLE } from '../common';

const { NAME, SCHEMA } = DATABASE_TABLE.YEAR_GRADE;
const { NAME: YEAR_NAME, SCHEMA: YEAR_SCHEMA } = DATABASE_TABLE.YEAR;
const { NAME: GRADE_NAME, SCHEMA: GRADE_SCHEMA } = DATABASE_TABLE.GRADE;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .createTable(NAME)
    .addColumn(SCHEMA.YEAR_ID, 'varchar(50)', (column) =>
      column.references(`${YEAR_NAME}.${YEAR_SCHEMA.ID}`),
    )
    .addColumn(SCHEMA.GRADE_ID, 'varchar(50)', (column) =>
      column.references(`${GRADE_NAME}.${GRADE_SCHEMA.ID}`),
    )
    .addPrimaryKeyConstraint('pk_classroom_year', [
      SCHEMA.YEAR_ID,
      SCHEMA.GRADE_ID,
    ])
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema.dropTable(NAME).execute();
}
