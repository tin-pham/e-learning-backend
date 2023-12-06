import { ApiProperty } from '@nestjs/swagger';
import {
  HealthCheckResult,
  HealthCheckStatus,
  HealthIndicatorResult,
} from '@nestjs/terminus';

export class HealthCheckRO implements HealthCheckResult {
  @ApiProperty()
  status: HealthCheckStatus;
  @ApiProperty({ required: false })
  info?: HealthIndicatorResult;
  @ApiProperty({ required: false })
  error?: HealthIndicatorResult;
  @ApiProperty()
  details: HealthIndicatorResult;
}
