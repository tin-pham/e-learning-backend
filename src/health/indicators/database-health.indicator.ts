import { Injectable } from '@nestjs/common';
import {
  HealthIndicator,
  HealthIndicatorResult,
  HealthCheckError,
} from '@nestjs/terminus';
import { DatabaseService } from '../../database';
import { sql } from 'kysely';

@Injectable()
export class DatabaseHealthIndicator extends HealthIndicator {
  constructor(private readonly databaseService: DatabaseService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.databaseService.executeQuery(
        sql`SELECT 1`.compile(this.databaseService),
      );
      return this.getStatus('database', true);
    } catch (error) {
      throw new HealthCheckError(
        'DatabaseHealthIndicator failed',
        this.getStatus('database', false),
      );
    }
  }
}
