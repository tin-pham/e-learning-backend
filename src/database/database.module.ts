import { Global, Module } from '@nestjs/common';
import {
  ConfigurableDatabaseModule,
  DATABASE_OPTIONS,
} from './database.module-definition';
import { DatabaseOptions } from './database.options';
import { Pool } from 'pg';
import { PostgresDialect, CamelCasePlugin } from 'kysely';
import { DatabaseService } from './database';

@Global()
@Module({
  exports: [DatabaseService],
  providers: [
    {
      provide: DatabaseService,
      inject: [DATABASE_OPTIONS],
      useFactory: (databaseOptions: DatabaseOptions) => {
        const dialect = new PostgresDialect({
          pool: new Pool({
            host: databaseOptions.host,
            port: databaseOptions.port,
            user: databaseOptions.user,
            password: databaseOptions.password,
            database: databaseOptions.database,
          }),
        });

        const plugins = [new CamelCasePlugin()];

        return new DatabaseService({
          dialect,
          plugins,
        });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
