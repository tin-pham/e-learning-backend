import { Injectable, Logger } from '@nestjs/common';
import { ElasticsearchService } from '@nestjs/elasticsearch';
import {
  LOG_LEVELS,
  ROLLING_INDEX_MODE,
} from './enum/elastic-search-logger.enum';
import {
  ErrorLevelException,
  InfoLevelException,
} from './interface/elastic-search-logger.interface';

@Injectable()
export class ElasticsearchLoggerService {
  private readonly rollingOffsetMode = ROLLING_INDEX_MODE.MONTHLY;
  private readonly stdout = false;
  private readonly indexesCache: Array<string> = [];
  private readonly logger = new Logger(ElasticsearchLoggerService.name);
  constructor(private readonly elasticsearchService: ElasticsearchService) {}

  public async info(message: InfoLevelException): Promise<string> {
    return this.log(message, LOG_LEVELS.INFO);
  }

  public async error(exception: ErrorLevelException): Promise<string> {
    return this.log(exception, LOG_LEVELS.ERROR);
  }

  public async debug<T>(message: T): Promise<string> {
    return this.log(message, LOG_LEVELS.DEBUG);
  }

  public async warning<T>(message: T): Promise<string> {
    return this.log(message, LOG_LEVELS.WARNING);
  }

  public async trace<T>(message: T): Promise<string> {
    return this.log(message, LOG_LEVELS.TRACE);
  }

  /**
   * Primary log message handler.
   *
   * @param {string} level
   * @param message
   * @param indice
   */
  public async log<T>(message: T, indice?: string): Promise<string> {
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

  public async raw<T>(message: T, indice?: string): Promise<string> {
    if (!!!indice) {
      indice = this.getRollingIndex(indice, this.rollingOffsetMode);
    }

    await this.createIndexIfNotExists(indice);

    const result = await this.elasticsearchService.index({
      index: indice,
      body: message,
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
