import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DifficultyRepository } from './difficulty.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { DifficultyGetListRO } from './ro/difficulty.ro';

@Injectable()
export class DifficultyService extends BaseService {
  private readonly logger = new Logger(DifficultyService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly difficultyRepository: DifficultyRepository,
  ) {
    super(elasticLogger);
  }

  async getList(decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const difficulties = await this.difficultyRepository.find();

      return this.success({
        classRO: DifficultyGetListRO,
        response: { data: difficulties },
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.DIFFICULTY.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }
}
