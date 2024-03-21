import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { CourseOutcomeRepository } from './course-outcome.repository';
import { CourseRepository } from '../course/course.repository';
import { CourseOutcomeStoreDTO, CourseOutcomeUpdateDTO } from './dto/course-outcome.dto';
import { CourseOutcomeStoreRO, CourseOutcomeUpdateRO } from './ro/course-outcome.ro';
import { CourseOutcomeEntity } from './course-outcome.entity';
import { ResultRO } from 'src/common/ro/result.ro';

@Injectable()
export class CourseOutcomeService extends BaseService {
  private readonly logger = new Logger(CourseOutcomeService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly _courseOutcomeRepository: CourseOutcomeRepository,
    private readonly _courseRepository: CourseRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: CourseOutcomeStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new CourseOutcomeStoreRO();

    try {
      const courseOutcomeData = new CourseOutcomeEntity();
      courseOutcomeData.name = dto.name;
      courseOutcomeData.courseId = dto.courseId;
      courseOutcomeData.createdBy = actorId;

      const courseOutcome = await this._courseOutcomeRepository.insert(courseOutcomeData);

      response.id = courseOutcome.id;
      response.name = courseOutcome.name;
      response.courseId = courseOutcome.courseId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_OUTCOME.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: CourseOutcomeStoreRO,
      response,
      message: 'Course outcome has been created successfully',
      actorId,
    });
  }

  async update(id: number, dto: CourseOutcomeUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new CourseOutcomeUpdateRO();

    try {
      const courseOutcomeData = new CourseOutcomeEntity();
      courseOutcomeData.name = dto.name;
      courseOutcomeData.updatedBy = actorId;
      courseOutcomeData.updatedAt = new Date();

      const courseOutcome = await this._courseOutcomeRepository.update(id, courseOutcomeData);

      response.id = courseOutcome.id;
      response.name = courseOutcome.name;
      response.courseId = courseOutcome.courseId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_OUTCOME.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: CourseOutcomeUpdateRO,
      response,
      message: 'Course outcome has been updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      await this._courseOutcomeRepository.delete(id, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_OUTCOME.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Course outcome has been deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: CourseOutcomeStoreDTO, actorId: number) {
    // Check course exist
    const courseCount = await this._courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { status, message, code } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // Check name exist same course
    const courseOutcomeCount = await this._courseOutcomeRepository.countByNameAndCourseId(dto.name, dto.courseId);
    if (courseOutcomeCount) {
      const { status, message, code } = EXCEPTION.COURSE_OUTCOME.ALREADY_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateUpdate(id: number, dto: CourseOutcomeUpdateDTO, actorId: number) {
    // Check exist
    const courseOutcome = await this._courseOutcomeRepository.findOneById(id);
    if (!courseOutcome) {
      const { status, message, code } = EXCEPTION.COURSE_OUTCOME.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // Check name exist same course except id
    const courseOutcomeCount = await this._courseOutcomeRepository.countByNameAndCourseIdExceptId(dto.name, courseOutcome.courseId, id);
    if (courseOutcomeCount) {
      const { status, message, code } = EXCEPTION.COURSE_OUTCOME.ALREADY_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const courseOutcomeCount = await this._courseOutcomeRepository.countById(id);
    if (!courseOutcomeCount) {
      const { status, message, code } = EXCEPTION.COURSE_OUTCOME.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
