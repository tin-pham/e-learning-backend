import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { SEMESTER } from '../semester/enum/semester.enum';
import { YearEntity } from './year.entity';
import { SemesterEntity } from '../semester/semester.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { YearRepository } from './year.repository';
import { SemesterRepository } from '../semester/semester.repository';
import { DatabaseService } from '../database/database.service';
import { YearGetListDTO } from './dto/year.dto';
import { YearDeleteRO, YearGetListRO, YearStoreRO } from './ro/year.ro';

@Injectable()
export class YearService extends BaseService {
  private readonly logger = new Logger(YearService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly yearRepository: YearRepository,
    private readonly semesterRepository: SemesterRepository,
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
      await this.database.transaction().execute(async (transaction) => {
        // Create year
        const yearData = new YearEntity();
        yearData.name = `${thisYear}/${nextYear}`;
        yearData.startDate = new Date(`09-02-${thisYear}`);
        yearData.endDate = new Date(`05-31-${nextYear}`);
        const year = await this.yearRepository.insertWithTransaction(
          transaction,
          yearData,
        );

        // Create semester
        const firstSemesterData = new SemesterEntity();
        firstSemesterData.name = SEMESTER.FIRST_SEMESTER;
        firstSemesterData.startDate = year.startDate;
        firstSemesterData.endDate = new Date(`12-22-${thisYear}`);
        firstSemesterData.yearId = year.id;

        const secondSemesterData = new SemesterEntity();
        secondSemesterData.name = SEMESTER.SECOND_SEMESTER;
        secondSemesterData.startDate = new Date(`12-25-${thisYear}`);
        secondSemesterData.endDate = year.endDate;
        secondSemesterData.yearId = year.id;

        await this.semesterRepository.insertMultipleWithTransaction(
          transaction,
          [firstSemesterData, secondSemesterData],
        );

        response.id = year.id;
        response.name = year.name;
        response.startDate = year.startDate;
        response.endDate = year.endDate;
      });
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

  async getList(dto: YearGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.yearRepository.find(dto);

      return this.success({
        classRO: YearGetListRO,
        response,
      });
    } catch (error) {
      const { status, code, message } = EXCEPTION.YEAR.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ status, code, message, actorId });
    }
  }

  async delete(id: string, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      const yearData = new YearEntity();
      yearData.deletedAt = new Date();
      yearData.deletedBy = actorId;
      await this.yearRepository.delete(id, yearData);
    } catch (error) {
      const { status, code, message } = EXCEPTION.YEAR.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, code, message, actorId });
    }

    return this.success({
      classRO: YearDeleteRO,
      response: { id },
      message: 'Year deleted successfully',
      actorId,
    });
  }

  private async validateDelete(id: string, actorId: string) {
    // Check exists
    const yearCount = await this.yearRepository.countById(id);
    if (!yearCount) {
      const { status, code, message } = EXCEPTION.YEAR.DOES_NOT_EXIST;
      this.throwException({ status, code, message, actorId });
    }
  }
}
