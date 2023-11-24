import { Module } from '@nestjs/common';
import { DbValidatorsModule } from '@youba/nestjs-dbvalidator';
import { ConfigModule } from './config';
import { DatabaseModule, databaseConfig } from './database';
import { UserModule } from './user';

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
    UserModule,
  ],
})
export class AppModule {}
