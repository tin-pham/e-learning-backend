import { Module } from '@nestjs/common';
import { TerminusModule } from '@nestjs/terminus';
import { CacheModule } from '../cache/cache.module';
import { ElasticsearchModule } from '../elastic-search/elastic-search.module';
import { DatabaseHealthIndicator } from './indicators/database-health.indicator';
import { HealthController } from './health.controller';
import { MemcacheHealthIndicator } from './indicators/memcache-health.indicator';
import { ElasticsearchHealthIndicator } from './indicators/elasticsearch-health.indicator';

@Module({
  imports: [TerminusModule, CacheModule, ElasticsearchModule],
  controllers: [HealthController],
  providers: [
    DatabaseHealthIndicator,
    MemcacheHealthIndicator,
    ElasticsearchHealthIndicator,
  ],
})
export class HealthModule {}
