import { Injectable } from '@nestjs/common';
import {
  HealthCheckError,
  HealthIndicator,
  HealthIndicatorResult,
  MemoryHealthIndicator,
} from '@nestjs/terminus';
import { CacheService } from '../../cache/cache.service';

@Injectable()
export class MemcacheHealthIndicator extends HealthIndicator {
  constructor(private readonly cacheService: CacheService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.cacheService.set('health', 'ok');
      await this.cacheService.del('health');
      return this.getStatus('memcache', true);
    } catch (error) {
      throw new HealthCheckError(
        `${MemoryHealthIndicator.name} failed`,
        this.getStatus('memcache', false),
      );
    }
  }
}
