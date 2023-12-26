import { Injectable, Logger } from '@nestjs/common';
import { YearRepository } from './year.repository';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { YearEntity } from './year.entity';
import { YearStoreRO } from './ro/year.ro';

@Injectable()
export class YearService extends BaseService {
  private readonly logger = new Logger(YearService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly yearRepository: YearRepository,
  ) {
    super(elasticLogger);
  }

  async create(decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const lastEndDate = await this.yearRepository.getLastEndDate();

    const response = new YearStoreRO();
    let thisYear: number;
    let nextYear: number;

    // Create current year
    if (!lastEndDate) {
      thisYear = new Date().getFullYear();
      nextYear = thisYear + 1;
    } else {
      thisYear = new Date(lastEndDate.endDate).getFullYear();
      nextYear = thisYear + 1;
    }

    try {
      const yearData = new YearEntity();
      yearData.name = `${thisYear}/${nextYear}`;
      yearData.startDate = new Date(`01-09-${thisYear}`);
      yearData.endDate = new Date(`30-05-${nextYear}`);

      const year = await this.yearRepository.insert(yearData);

      response.id = year.id;
      response.name = year.name;
      response.startDate = year.startDate;
      response.endDate = year.endDate;
    } catch (error) {
      const { status, code, message } = EXCEPTION.YEAR.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, code, message, actorId });
    }

    return this.success({
      classRO: YearStoreRO,
      actorId: decoded.userId,
      message: 'Year created successfully',
      response,
    });
  }
}
