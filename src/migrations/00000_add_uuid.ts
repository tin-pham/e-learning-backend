import { sql } from 'kysely';
import { DatabaseService } from '../database';

export async function up(database: DatabaseService): Promise<void> {
  await database.executeQuery(
    sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.compile(database),
  );
}

export async function down(database: DatabaseService): Promise<void> {
  await database.executeQuery(
    sql`DROP EXTENSION IF EXISTS "uuid-ossp";`.compile(database),
  );
}
