import { Kysely, sql } from 'kysely';

export async function up(database: Kysely<unknown>): Promise<void> {
  await database.executeQuery(
    sql`CREATE EXTENSION IF NOT EXISTS "uuid-ossp";`.compile(database),
  );
}

export async function down(database: Kysely<unknown>): Promise<void> {
  await database.executeQuery(
    sql`DROP EXTENSION IF EXISTS "uuid-ossp";`.compile(database),
  );
}
