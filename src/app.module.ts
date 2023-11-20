import { Module } from '@nestjs/common';
import { DbValidatorsModule } from '@youba/nestjs-dbvalidator';
import { AppController } from './app.controller';
import { ConfigModule } from './config';
import { DatabaseModule, databaseConfig } from './database';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(databaseConfig),
    DbValidatorsModule.register({
      host: databaseConfig.host,
      port: databaseConfig.port,
      type: 'postgres',
      database: databaseConfig.database,
      username: databaseConfig.user,
      password: databaseConfig.password,
    }),
  ],
  controllers: [AppController],
})
export class AppModule {}
