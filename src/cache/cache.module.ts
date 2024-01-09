import { Module } from '@nestjs/common';
import { CacheModule as NestCacheModule } from '@nestjs/cache-manager';
import memcachedStore from 'cache-manager-memcached-store';
import { CacheService } from './cache.service';
import Memcache from 'memcache-pp';

@Module({
  imports: [
    NestCacheModule.register({
      store: memcachedStore,
      driver: Memcache,
      options: {
        hosts: ['memcached:11211'],
      },
      ttl: 60,
    }),
  ],
  providers: [CacheService],
  exports: [CacheService],
})
export class CacheModule {}
