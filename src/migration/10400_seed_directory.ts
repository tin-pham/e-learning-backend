import { DatabaseService } from '../database';

let id: number;

export async function up(database: DatabaseService): Promise<void> {
  const directory = await database.insertInto('directory').values({ name: 'root' }).returning(['id']).executeTakeFirst();
  id = directory.id;
}

export async function down(database: DatabaseService): Promise<void> {
  await database.deleteFrom('directory').where('id', '=', id).execute();
}
