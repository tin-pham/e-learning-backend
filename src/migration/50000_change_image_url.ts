import { DATABASE_TABLE } from '../common';
import { DatabaseService } from '../database';

const { NAME, SCHEMA } = DATABASE_TABLE.IMAGE;

export async function up(database: DatabaseService): Promise<void> {
  await database.schema
    .alterTable(NAME)
    .alterColumn(SCHEMA.URL, (ac) => ac.setDataType('text'))
    .execute();
}

export async function down(database: DatabaseService): Promise<void> {
  await database.schema
    .alterTable(NAME)
    .alterColumn(SCHEMA.URL, (ac) => ac.setDataType('varchar(255)'))
    .execute();
}
