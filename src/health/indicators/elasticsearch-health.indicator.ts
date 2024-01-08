import { Injectable } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { HealthCheckError, HealthIndicator, HealthIndicatorResult } from '@nestjs/terminus';

@Injectable()
export class ElasticsearchHealthIndicator extends HealthIndicator {
  constructor(private readonly elasticsearchService: ElasticsearchService) {
    super();
  }

  async isHealthy(): Promise<HealthIndicatorResult> {
    try {
      await this.elasticsearchService.cluster.health({
        wait_for_status: 'yellow',
        timeout: '60s',
        filter_path: [
          'number_of_nodes',
          'number_of_data_nodes',
          'active_primary_shards',
          'active_shards',
          'relocating_shards',
          'initializing_shards',
          'unassigned_shards',
        ],
      });
      return this.getStatus('elasticsearch', true);
    } catch (error) {
      throw new HealthCheckError(`${ElasticsearchHealthIndicator.name} failed`, this.getStatus('elasticsearch', false));
    }
  }
}
