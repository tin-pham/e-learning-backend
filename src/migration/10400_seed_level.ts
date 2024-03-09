import { LEVEL_DATA } from '../level/seed/level.seed';
import { DatabaseService } from '../database';

const seededIds: number[] = [];

export async function up(database: DatabaseService): Promise<void> {
  const levels = await database.insertInto('level').values(LEVEL_DATA).returning(['id']).execute();
  levels.forEach((level) => {
    seededIds.push(level.id);
  });
}

export async function down(database: DatabaseService): Promise<void> {
  await database.deleteFrom('level').where('id', 'in', seededIds).execute();
}
