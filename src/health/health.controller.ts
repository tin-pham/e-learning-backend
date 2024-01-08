import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiInternalServerErrorResponse, ApiOkResponse, ApiTags } from '@nestjs/swagger';
import { HealthCheck, HealthCheckService } from '@nestjs/terminus';
import { API, HttpExceptionRO } from '../common';
import { Roles } from '../auth/role/role.decorator';
import { JwtGuard } from '../auth/jwt/jwt.guard';
import { RoleGuard } from '../auth/role/role.guard';
import { ROLE } from '../role/enum/role.enum';
import { DatabaseHealthIndicator } from './indicators/database-health.indicator';
import { MemcacheHealthIndicator } from './indicators/memcache-health.indicator';
import { ElasticsearchHealthIndicator } from './indicators/elasticsearch-health.indicator';
import { HealthCheckRO } from './ro/health.ro';

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
  @Roles(ROLE.ADMIN)
  @UseGuards(JwtGuard, RoleGuard)
  @HealthCheck()
  check() {
    return this.healthCheckService.check([
      () => this.databaseHealthIndicator.isHealthy(),
      () => this.memcacheHealthIndicator.isHealthy(),
      () => this.elasticsearchHealthIndicator.isHealthy(),
    ]);
  }
}
