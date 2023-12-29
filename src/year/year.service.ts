import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { SEMESTER } from '../semester/enum/semester.enum';
import { YearEntity } from './year.entity';
import { SemesterEntity } from '../semester/semester.entity';
import { YearGradeEntity } from '../year-grade/year-grade.entity';
import { ClassroomYearEntity } from '../classroom-year/classroom-year.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { YearRepository } from './year.repository';
import { SemesterRepository } from '../semester/semester.repository';
import { ClassroomRepository } from '../classroom/classroom.repository';
import { ClassroomYearRepository } from '../classroom-year/classroom-year.repository';
import { GradeRepository } from '../grade/grade.repository';
import { YearGradeRepository } from '../year-grade/year-grade.repository';
import { DatabaseService } from '../database/database.service';
import { YearGetListDTO, YearUpdateDTO } from './dto/year.dto';
import {
  YearDeleteRO,
  YearGetListRO,
  YearStoreRO,
  YearUpdateRO,
} from './ro/year.ro';

@Injectable()
export class YearService extends BaseService {
  private readonly logger = new Logger(YearService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly yearRepository: YearRepository,
    private readonly semesterRepository: SemesterRepository,
    private readonly classroomRepository: ClassroomRepository,
    private readonly classroomYearRepository: ClassroomYearRepository,
    private readonly gradeRepository: GradeRepository,
    private readonly yearGradeRepository: YearGradeRepository,
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
        yearData.createdBy = actorId;
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
        firstSemesterData.createdBy = actorId;

        const secondSemesterData = new SemesterEntity();
        secondSemesterData.name = SEMESTER.SECOND_SEMESTER;
        secondSemesterData.startDate = new Date(`12-25-${thisYear}`);
        secondSemesterData.endDate = year.endDate;
        secondSemesterData.yearId = year.id;
        secondSemesterData.createdBy = actorId;

        await this.semesterRepository.insertMultipleWithTransaction(
          transaction,
          [firstSemesterData, secondSemesterData],
        );

        // Store classroomYear
        const classrooms = await this.classroomRepository.getIds();
        if (classrooms.length) {
          const classroomIds = classrooms.map((classroom) => classroom.id);
          const classroomYearsData = classroomIds.map(
            (classroomId) =>
              new ClassroomYearEntity({
                classroomId,
                yearId: year.id,
                createdBy: actorId,
              }),
          );

          await this.classroomYearRepository.insertMultipleWithTransaction(
            transaction,
            classroomYearsData,
          );
        }

        // Store yearGrade
        const grades = await this.gradeRepository.getIds();
        if (grades.length) {
          const gradeIds = grades.map((grade) => grade.id);
          const yearGradesData = gradeIds.map(
            (gradeId) =>
              new YearGradeEntity({
                yearId: year.id,
                gradeId,
                createdBy: actorId,
              }),
          );

          await this.yearGradeRepository.insertMultipleWithTransaction(
            transaction,
            yearGradesData,
          );
        }

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
      await this.database.transaction().execute(async (transaction) => {
        // Delete year
        await this.yearRepository.deleteWithTransaction(
          transaction,
          id,
          actorId,
        );

        // Delete semester
        const semesters = await this.semesterRepository.getIdsByYearId(id);
        if (semesters.length) {
          const semesterIds = semesters.map((semester) => semester.id);
          await this.semesterRepository.deleteMultipleWithTransaction(
            transaction,
            semesterIds,
            actorId,
          );
        }

        // Delete classroomYear
        const classroomYears =
          await this.classroomYearRepository.getIdsByYearId(id);
        if (classroomYears.length) {
          const classroomYearIds = classroomYears.map(
            (classroomYear) => classroomYear.id,
          );
          await this.classroomYearRepository.deleteMultipleWithTransaction(
            transaction,
            classroomYearIds,
            actorId,
          );
        }

        // Delete yearGrade
        console.log(actorId);
        const yearGrades = await this.yearGradeRepository.getIdsByYearId(id);
        if (yearGrades.length) {
          const yearGradeIds = yearGrades.map((yearGrade) => yearGrade.id);
          await this.yearGradeRepository.deleteMultipleWithTransaction(
            transaction,
            yearGradeIds,
            actorId,
          );
        }
      });
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

  async update(id: string, dto: YearUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, actorId);

    const response = new YearUpdateRO();

    try {
      const yearData = new YearEntity();
      yearData.updatedAt = new Date();
      yearData.updatedBy = actorId;
      if (dto.startDate) {
        yearData.startDate = dto.startDate;
      }
      if (dto.endDate) {
        yearData.endDate = dto.endDate;
      }
      const year = await this.yearRepository.update(id, yearData);

      response.id = year.id;
      response.name = year.name;
      response.startDate = year.startDate;
      response.endDate = year.endDate;
    } catch (error) {
      const { status, code, message } = EXCEPTION.YEAR.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ status, code, message, actorId });
    }

    return this.success({
      classRO: YearUpdateRO,
      actorId,
      message: 'Year updated successfully',
      response,
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

  private async validateUpdate(id: string, actorId: string) {
    // Check exists
    const yearCount = await this.yearRepository.countById(id);
    if (!yearCount) {
      const { status, code, message } = EXCEPTION.YEAR.DOES_NOT_EXIST;
      this.throwException({ status, code, message, actorId });
    }
  }
}
