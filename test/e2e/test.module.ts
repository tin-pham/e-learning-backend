import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule, databaseConfig } from '../../src/database';

@Module({
  imports: [ConfigModule.forRoot(), DatabaseModule.forRoot(databaseConfig)],
})
export class TestModule {}
