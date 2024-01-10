import { DatabaseService } from '../database';
import { DIFFILCULTY_DATA } from '../difficulty/assets/difficulty.seed';

const seededIds: number[] = [];

export async function up(database: DatabaseService): Promise<void> {
  const difficulties = await database.insertInto('difficulty').values(DIFFILCULTY_DATA).returning(['id']).execute();
  difficulties.forEach((difficulty) => {
    seededIds.push(difficulty.id);
  });
}

export async function down(database: DatabaseService): Promise<void> {
  await database.deleteFrom('difficulty').where('id', 'in', seededIds).execute();
}
