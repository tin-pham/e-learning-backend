import { Inject, Injectable } from '@nestjs/common';
import { CACHE_MANAGER } from '@nestjs/cache-manager';
import { Cache } from 'cache-manager';

@Injectable()
export class CacheService {
  constructor(@Inject(CACHE_MANAGER) private readonly cacheManager: Cache) {}

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
