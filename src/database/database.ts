import { Kysely } from 'kysely';

export interface KyselyTables {}

export class DatabaseService extends Kysely<KyselyTables> {}
