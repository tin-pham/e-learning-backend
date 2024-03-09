import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LevelRepository } from './level.repository';
import { LevelGetListRO } from './ro/level.ro';

@Injectable()
export class LevelService extends BaseService {
  private readonly logger = new Logger(LevelService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly levelRepository: LevelRepository,
  ) {
    super(elasticLogger);
  }

  async getList(decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const levels = await this.levelRepository.find();
      return this.success({
        classRO: LevelGetListRO,
        response: { data: levels },
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.LEVEL.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }
}
