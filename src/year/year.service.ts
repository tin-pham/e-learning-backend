import { Injectable } from '@nestjs/common';
import { YearRepository } from './year.repository';
import { BaseService } from '../base';
import { IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { YearEntity } from './year.entity';
import { YearStoreRO } from './ro/year.ro';

@Injectable()
export class YearService extends BaseService {
  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly yearRepository: YearRepository,
  ) {
    super(elasticLogger);
  }

  async create(decoded: IJwtPayload) {
    const lastEndDate = await this.yearRepository.getLastEndDate();

    const response = new YearStoreRO();

    // Create current year
    if (!lastEndDate) {
      const yearData = new YearEntity();
      const thisYear = new Date().getFullYear();
      const nextYear = thisYear + 1;

      yearData.name = `${thisYear}/${nextYear}`;
      yearData.startDate = new Date(`01-09-${thisYear}`);
      yearData.endDate = new Date(`30-05-${nextYear}`);

      const year = await this.yearRepository.insert(yearData);

      response.id = year.id;
      response.name = year.name;
      response.startDate = year.startDate;
      response.endDate = year.endDate;
    } else {
      const lastYear = new Date(lastEndDate.endDate).getFullYear();

      const yearData = new YearEntity();

      const thisYear = lastYear;
      const nextYear = thisYear + 1;

      yearData.name = `${thisYear}/${nextYear}`;
      yearData.startDate = new Date(`01-09-${thisYear}`);
      yearData.endDate = new Date(`30-05-${nextYear}`);
    }

    return this.success({
      classRO: YearStoreRO,
      actorId: decoded.userId,
      message: 'Year created successfully',
      response,
    });
  }
}
