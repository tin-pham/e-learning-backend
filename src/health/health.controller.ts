import { Controller, Get, UseGuards } from '@nestjs/common';
import {
  ApiBearerAuth,
  ApiInternalServerErrorResponse,
  ApiOkResponse,
  ApiTags,
} from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { API, HttpExceptionRO } from '../common';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { USER_ROLE } from '../user-role/user-role.enum';
import { DatabaseHealthIndicator } from './indicators/database-health.indicator';
import { MemcacheHealthIndicator } from './indicators/memcache-health.indicator';
import { HealthCheckRO } from './ro/health.ro';
import { ElasticsearchHealthIndicator } from './indicators/elasticsearch-health.indicator';

const { TAGS, CONTROLLER } = API.HEALTH;

@ApiTags(TAGS)
@Controller(CONTROLLER)
export class HealthController {
  constructor(
    private readonly healthCheckService: HealthCheckService,
    private readonly databaseHealthIndicator: DatabaseHealthIndicator,
    private readonly memcacheHealthIndicator: MemcacheHealthIndicator,
    private readonly elasticsearchHealthIndicator: ElasticsearchHealthIndicator,
  ) {}

  @Get()
  @ApiOkResponse({ type: HealthCheckRO })
  @ApiInternalServerErrorResponse({ type: HttpExceptionRO })
  @ApiBearerAuth('Authorization')
  @UseGuards(JwtGuard, RoleGuard(USER_ROLE.ADMIN))
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.databaseHealthIndicator.isHealthy(),
      () => this.memcacheHealthIndicator.isHealthy(),
      () => this.elasticsearchHealthIndicator.isHealthy(),
    ]);
  }
}
