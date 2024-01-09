import { DatabaseService } from '../database';
import { MAIN_MENU, PERMISSION_MENU } from '../menu/asset/menu.seed';
import { MAIN_MENU_ID, PERMISSION_MENU_ID } from '../menu/enum/menu.enum';

let seededIds: number[] = [];

export async function up(database: DatabaseService): Promise<void> {
  // Seed Main Menu
  await database.insertInto('menu').values(MAIN_MENU).execute();

  // Seed Permission Sub-menu
  await database.insertInto('menu').values(PERMISSION_MENU).execute();

  seededIds = [...Object.values(MAIN_MENU_ID), ...Object.values(PERMISSION_MENU_ID)];
}

export async function down(database: DatabaseService): Promise<void> {
  await database.deleteFrom('menu').where('id', 'in', seededIds).execute();
}
