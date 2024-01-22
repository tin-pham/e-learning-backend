import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { CourseRepository } from '../course/course.repository';
import { StudentRepository } from '../student/student.repository';
import { CourseStudentBulkDeleteDTO, CourseStudentBulkStoreDTO } from './dto/course-student.dto';
import { CourseStudentRepository } from './course-student.repository';
import { CourseStudentEntity } from './course-student.entity';
import { ResultRO } from 'src/common/ro/result.ro';

@Injectable()
export class CourseStudentService extends BaseService {
  private readonly logger = new Logger(CourseStudentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly courseRepository: CourseRepository,
    private readonly studentRepository: StudentRepository,
    private readonly courseStudentRepository: CourseStudentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: CourseStudentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const courseStudenData = dto.courseIds.flatMap((courseId) =>
        dto.studentIds.map((studentId) => new CourseStudentEntity({ courseId, studentId, createdBy: actorId })),
      );
      await this.courseStudentRepository.insertMultiple(courseStudenData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_STUDENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Bulk store course student successfully',
      actorId,
    });
  }

  async bulkDelete(dto: CourseStudentBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.courseStudentRepository.deleteMultipleByCourseIdsAndStudentIds(dto.courseIds, dto.studentIds, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_STUDENT.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Bulk delete course student successfully',
      actorId,
    });
  }

  private async validateBulkStore(dto: CourseStudentBulkStoreDTO, actorId: number) {
    // Check course exist
    const courseCount = await this.courseRepository.countByIds(dto.courseIds);
    if (courseCount !== dto.courseIds.length) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exist
    const studentCount = await this.studentRepository.countByIds(dto.studentIds);
    if (studentCount !== dto.studentIds.length) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check course student unique
    const courseStudentCount = await this.courseStudentRepository.countByCourseIdsAndStudentIds(dto.courseIds, dto.studentIds);
    if (courseStudentCount) {
      const { code, status, message } = EXCEPTION.COURSE_STUDENT.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(dto: CourseStudentBulkDeleteDTO, actorId: number) {
    // Check course exist
    const courseCount = await this.courseRepository.countByIds(dto.courseIds);
    if (courseCount !== dto.courseIds.length) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exist
    const studentCount = await this.studentRepository.countByIds(dto.studentIds);
    if (studentCount !== dto.studentIds.length) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check course student exist
    const courseStudentCount = await this.courseStudentRepository.countByCourseIdsAndStudentIds(dto.courseIds, dto.studentIds);
    if (!courseStudentCount) {
      const { code, status, message } = EXCEPTION.COURSE_STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
