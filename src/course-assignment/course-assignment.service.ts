import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { CourseRepository } from '../course/course.repository';
import { CourseAssignmentRepository } from './course-assignment.repository';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { CourseAssignmentBulkDeleteDTO, CourseAssignmentBulkStoreDTO } from './dto/course-assignment.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class CourseAssignmentService extends BaseService {
  private readonly logger = new Logger(CourseAssignmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly courseAssignmentRepository: CourseAssignmentRepository,
    private readonly courseRepository: CourseRepository,
    private readonly assignmentRepository: AssignmentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: CourseAssignmentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const courseAssignmentData = dto.courseIds.flatMap((courseId) =>
        dto.assignmentIds.map((assignmentId) => ({
          courseId,
          assignmentId,
        })),
      );
      await this.courseAssignmentRepository.insertMultiple(courseAssignmentData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_ASSIGNMENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Course assignment stored successfully',
      actorId,
    });
  }

  async bulkDelete(dto: CourseAssignmentBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.courseAssignmentRepository.deleteMultipleByCourseIdsAndAssignmentIds(dto.courseIds, dto.assignmentIds, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_ASSIGNMENT.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Course assignment deleted successfully',
      actorId,
    });
  }

  private async validateBulkStore(dto: CourseAssignmentBulkStoreDTO, actorId: number) {
    // Check course exist
    const courseCount = await this.courseRepository.countByIds(dto.courseIds);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check assignment exist
    const assignmentCount = await this.assignmentRepository.countByIds(dto.assignmentIds);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check course assignment unique
    const courseAssignmentCount = await this.courseAssignmentRepository.countByCouseIdsAndAssignmentIds(dto.courseIds, dto.assignmentIds);
    if (courseAssignmentCount) {
      const { code, status, message } = EXCEPTION.COURSE_ASSIGNMENT.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(dto: CourseAssignmentBulkDeleteDTO, actorId: number) {
    // Check course exist
    const courseCount = await this.courseRepository.countByIds(dto.courseIds);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check assignment exist
    const assignmentCount = await this.assignmentRepository.countByIds(dto.assignmentIds);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check course assignment exist
    const courseAssignmentCount = await this.courseAssignmentRepository.countByCouseIdsAndAssignmentIds(dto.courseIds, dto.assignmentIds);
    if (!courseAssignmentCount) {
      const { code, status, message } = EXCEPTION.COURSE_ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
