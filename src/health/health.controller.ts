import { Controller, Get } from '@nestjs/common';
import { ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { API } from '../common';
import { DatabaseHealthIndicator } from './indicators/database-health.indicator';
import { MemcacheHealthIndicator } from './indicators/memcache-health.indicator';
import { HealthCheckRO } from './ro/health.ro';

const { TAGS, CONTROLLER } = API.HEALTH;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly databaseHealthIndicator: DatabaseHealthIndicator,
    private readonly memcacheHealthIndicator: MemcacheHealthIndicator,
  ) {}

  @Get()
  @ApiOkResponse({ type: HealthCheckRO })
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.databaseHealthIndicator.isHealthy(),
      () => this.memcacheHealthIndicator.isHealthy(),
    ]);
  }
}
