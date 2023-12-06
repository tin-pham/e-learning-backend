import { Inject, Injectable, OnApplicationShutdown } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService implements OnApplicationShutdown {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

  onApplicationShutdown() {
    this.cacheManager.reset();
  }

  get(key: string) {
    return this.cacheManager.get(key);
  }

  set(key: string, value: any, ttl?: number) {
    return this.cacheManager.set(key, value, ttl);
  }

  del(key: string) {
    return this.cacheManager.del(key);
  }
}
