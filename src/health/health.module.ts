import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CacheModule } from '../cache/cache.module';
import { DatabaseHealthIndicator } from './indicators/database-health.indicator';
import { HealthController } from './health.controller';
import { MemcacheHealthIndicator } from './indicators/memcache-health.indicator';

@Module({
  imports: [TerminusModule, CacheModule],
  controllers: [HealthController],
  providers: [DatabaseHealthIndicator, MemcacheHealthIndicator],
})
export class HealthModule {}
