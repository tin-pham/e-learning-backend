import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { BaseService } from '../../base';
import { EXCEPTION } from '../../common';
import { ElasticsearchLoggerService } from '../../elastic-search-logger/elastic-search-logger.service';

@Injectable()
export class ApiKeyService extends BaseService {
  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly configService: ConfigService,
  ) {
    super(elasticLogger);
  }

  validate(apiKey: string) {
    const isMatch = this.configService.get<string>('API_KEY') === apiKey;

    if (!isMatch) {
      const { code, status, message } = EXCEPTION.AUTH.API_KEY_INVALID;
      this.throwException({ code, status, message, actorId: 'api-key' });
    }

    return true;
  }
}
