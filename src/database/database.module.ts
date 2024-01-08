import { Global, Module } from '@nestjs/common';
import { ConfigurableDatabaseModule, DATABASE_OPTIONS } from './database.module-definition';
import { DatabaseOptions } from './database.options';
import { Pool } from 'pg';
import { PostgresDialect, CamelCasePlugin } from 'kysely';
import { DatabaseService } from './database.service';
import { ElasticsearchLoggerModule } from '../elastic-search-logger/elastic-search-logger.module';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';

@Global()
@Module({
  imports: [ElasticsearchLoggerModule],
  exports: [DatabaseService],
  providers: [
    {
      provide: DatabaseService,
      inject: [DATABASE_OPTIONS, ElasticsearchLoggerService],
      useFactory: (databaseOptions: DatabaseOptions, elasticLogger: ElasticsearchLoggerService) => {
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
          log(event) {
            if (event.level === 'query') {
              const { sql, parameters } = event.query;
              elasticLogger.query({
                sql,
                parameters: parameters as unknown[],
              });
            }
          },
        });
      },
    },
  ],
})
export class DatabaseModule extends ConfigurableDatabaseModule {}
