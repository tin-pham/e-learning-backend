import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ROLE } from '../role/enum/role.enum';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { CourseRepository } from '../course/course.repository';
import { StudentRepository } from '../student/student.repository';
import {
  CourseStudentBulkDeleteDTO,
  CourseStudentBulkStoreDTO,
  CourseStudentCheckRegisteredDTO,
  CourseStudentIsRegisteredDTO,
  CourseStudentRegisterDTO,
  CourseStudentUnRegisterDTO,
} from './dto/course-student.dto';
import { CourseStudentRepository } from './course-student.repository';
import { CourseStudentEntity } from './course-student.entity';
import { ResultRO } from '../common/ro/result.ro';
import { CourseStudentRegisterRO, CourseStudentUnRegisterRO } from './ro/course-student.ro';

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

  async isRegistered(dto: CourseStudentIsRegisteredDTO, decoded: IJwtPayload) {
    const { userId: actorId, roles } = decoded;

    // Don't need to check if not student
    if (!roles.includes(ROLE.STUDENT)) {
      return this.success({
        classRO: ResultRO,
        response: { result: true },
      });
    }

    // Check course exist
    const courseCount = await this.courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { status, message, code } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    const student = await this.studentRepository.getStudentIdByUserId(actorId);
    const courseStudentCount = await this.courseStudentRepository.countByCourseIdAndStudentId(dto.courseId, student.id);
    if (!courseStudentCount) {
      return this.success({
        classRO: ResultRO,
        response: { result: false },
      });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
    });
  }

  async checkRegistered(dto: CourseStudentCheckRegisteredDTO, decoded: IJwtPayload) {
    const { roles, userId: actorId } = decoded;

    const courseCount = await this.courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { status, message, code } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    if (!roles.includes(ROLE.STUDENT)) {
      return this.success({
        classRO: ResultRO,
        response: { result: true },
      });
    }

    let courseStudent;
    try {
      const student = await this.studentRepository.getStudentIdByUserId(actorId);
      courseStudent = await this.courseStudentRepository.countByCourseIdAndStudentId(dto.courseId, student.id);
    } catch (error) {
      const { status, message, code } = EXCEPTION.COURSE_STUDENT.CHECK_REGISTERED_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    if (!courseStudent) {
      const { status, message, code } = EXCEPTION.COURSE_STUDENT.NOT_REGISTERED;
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
    });
  }

  async register(dto: CourseStudentRegisterDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.checkRegister(dto, actorId);

    const response = new CourseStudentRegisterRO();

    try {
      const student = await this.studentRepository.getStudentIdByUserId(actorId);
      const data = new CourseStudentEntity({ courseId: dto.courseId, studentId: student.id });

      const courseStudent = await this.courseStudentRepository.insert(data);

      response.id = courseStudent.id;
      response.courseId = courseStudent.courseId;
      response.studentId = courseStudent.studentId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_STUDENT.REGISTER_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: CourseStudentRegisterRO,
      response,
    });
  }

  async unregister(dto: CourseStudentUnRegisterDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { student } = await this.checkUnRegister(dto, actorId);

    const response = new CourseStudentUnRegisterRO();

    try {
      const courseStudent = await this.courseStudentRepository.deleteByCourseIdAndStudentId(dto.courseId, student.id, actorId);

      response.id = courseStudent.id;
    } catch (error) {
      const { code, status, message } = EXCEPTION.COURSE_STUDENT.UNREGISTER_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
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

  private async checkRegister(dto: CourseStudentRegisterDTO, actorId: number) {
    // Check course exist
    const courseCount = await this.courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
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

  private async checkUnRegister(dto: CourseStudentUnRegisterDTO, actorId: number) {
    // Check course exist
    const courseCount = await this.courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    const student = await this.studentRepository.getStudentIdByUserId(actorId);

    // Check course student exist
    const courseStudent = await this.courseStudentRepository.countByCourseIdAndStudentId(dto.courseId, student.id);
    if (!courseStudent) {
      const { code, status, message } = EXCEPTION.COURSE_STUDENT.NOT_REGISTERED;
      this.throwException({ code, status, message, actorId });
    }

    return {
      student,
    };
  }
}
