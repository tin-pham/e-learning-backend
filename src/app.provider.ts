import { APP_GUARD } from '@nestjs/core';
import { ThrottlerGuard } from './throttler/throttler.guard';
import { RoleService } from './auth/role/role.service';

export const appProviders = [
  {
    provide: APP_GUARD,
    useClass: ThrottlerGuard,
  },
  RoleService,
];
