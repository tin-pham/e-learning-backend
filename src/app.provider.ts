import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from './throttler/throttler.guard';

export const appProviders = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
];
