import { Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { DatabaseModule, databaseConfig } from './database';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule.forRoot(databaseConfig)],
})
export class AppModule {}
