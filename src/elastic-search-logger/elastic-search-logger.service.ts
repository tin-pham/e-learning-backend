import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import { plainToInstance } from 'class-transformer';
import {
  LOG_INDEXES,
  ROLLING_INDEX_MODE,
} from './enum/elastic-search-logger.enum';
import {
  ErrorIndex,
  InfoIndex,
  QueryIndex,
} from './interface/elastic-search-logger.interface';
import { PaginateDTO } from '../common/dto/paginate.dto';
import { ElasticsearchLoggerGetInfoDTO } from './dto/elastic-search-logger.dto';
import {
  ElasticsearchLoggerGetErrorRO,
  ElasticsearchLoggerGetInfoRO,
} from './ro/elastic-searrch-logger.ro';

@Injectable()
export class ElasticsearchLoggerService {
  private readonly rollingOffsetMode = ROLLING_INDEX_MODE.MONTHLY;
  private readonly stdout = false;
  private readonly indexesCache: Array<string> = [];
  private readonly logger = new Logger(ElasticsearchLoggerService.name);

  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  info(obj: InfoIndex): Promise<string> {
    return this.log(obj, LOG_INDEXES.INFO);
  }

  error(exception: ErrorIndex): Promise<string> {
    return this.log(exception, LOG_INDEXES.ERROR);
  }

  warning<T>(message: T): Promise<string> {
    return this.log(message, LOG_INDEXES.WARNING);
  }

  // WARNING: Some how enum not init index, first string, then enum, need fix
  query(query: QueryIndex): Promise<string> {
    return this.log(query, LOG_INDEXES.QUERY);
  }

  async getError(dto: PaginateDTO) {
    // Get logs
    const offset = (dto.page - 1) * dto.limit;
    const { body } = await this.elasticsearchService.search({
      index: LOG_INDEXES.ERROR,
      size: dto.limit,
      from: offset,
      body: {
        sort: [
          {
            date: { order: 'desc' },
          },
        ],
      },
    });

    const response = body['hits'].hits;
    const data = response.map((item) => ({
      message: item._source.message,
      date: new Date(item._source.date).toLocaleString(),
    }));

    // Count total logs
    const { body: bodyCount } = await this.elasticsearchService.count({
      index: LOG_INDEXES.INFO,
    });

    return plainToInstance(
      ElasticsearchLoggerGetErrorRO,
      {
        data,
        meta: {
          itemsPerPage: dto.limit,
          currentPage: dto.page,
          totalItems: bodyCount['count'],
          totalPage: Math.ceil(bodyCount['count'] / dto.limit),
        },
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  async getInfo(dto: ElasticsearchLoggerGetInfoDTO) {
    // Get logs
    const offset = (dto.page - 1) * dto.limit;
    const { body } = await this.elasticsearchService.search({
      index: LOG_INDEXES.INFO,
      size: dto.limit,
      from: offset,
      body: {
        // TODO: Filter by date
        sort: [
          {
            date: { order: 'desc' },
          },
        ],
      },
    });

    const response = body['hits'].hits;
    const data = response.map((item) => ({
      message: item._source.message,
      date: new Date(item._source.date).toLocaleString(),
    }));

    // Count total logs
    const { body: bodyCount } = await this.elasticsearchService.count({
      index: LOG_INDEXES.INFO,
    });

    return plainToInstance(
      ElasticsearchLoggerGetInfoRO,
      {
        data,
        meta: {
          itemsPerPage: dto.limit,
          currentPage: dto.page,
          totalItems: bodyCount['count'],
          totalPage: Math.ceil(bodyCount['count'] / dto.limit),
        },
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  private async log<T>(message: T, indice?: string): Promise<string> {
    if (!!!indice) {
      indice = this.getRollingIndex(indice, this.rollingOffsetMode);
    }

    await this.createIndexIfNotExists(indice);

    const result = await this.elasticsearchService.index({
      index: indice,
      body: {
        ...message,
        date: new Date().toISOString(),
      },
    });

    if (this.stdout) {
      this.logger.log(
        `[${ElasticsearchLoggerService.name}] ${JSON.stringify(message)}`,
      );
    }

    return result.body['_id'];
  }

  private async createIndexIfNotExists(index: string) {
    if (this.indexesCache.indexOf(index) > -1) {
      return;
    }

    const result = await this.elasticsearchService.indices.exists({ index });

    if (result.statusCode !== 200) {
      await this.elasticsearchService.indices.create({ index });
    }
    this.indexesCache.push(index);
  }

  private getRollingIndex(prefix: string, mode: ROLLING_INDEX_MODE) {
    return `${prefix}-${new Date().toISOString().slice(0, mode)}`;
  }
}
