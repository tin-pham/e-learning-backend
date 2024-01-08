import { Injectable, Logger } from '@nestjs/common';
import { ClassroomYearAssignmentBulkStoreDTO } from './dto/classroom-year-assignment.dto';
import { EXCEPTION, IJwtPayload } from '../common';
import { BaseService } from '../base';
import { ClassroomYearAssignmentEntity } from './classroom-year-assignment.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ClassroomYearRepository } from '../classroom-year/classroom-year.repository';
import { ClassroomYearAssignmentRepository } from './classroom-year-assignment.repository';
import { TeacherSubjectRepository } from '../teacher-subject/teacher-subject.repository';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class ClassroomYearAssignmentService extends BaseService {
  private readonly logger = new Logger(ClassroomYearAssignmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly classroomYearRepository: ClassroomYearRepository,
    private readonly teacherSubjectRepository: TeacherSubjectRepository,
    private readonly classroomYearAssignmentRepository: ClassroomYearAssignmentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: ClassroomYearAssignmentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const classroomYearTeachersData = dto.classroomYearIds.flatMap((classroomYearId) =>
        dto.teacherSubjectIds.map(
          (teacherSubjectId) =>
            new ClassroomYearAssignmentEntity({
              classroomYearId,
              teacherSubjectId,
              createdBy: actorId,
            }),
        ),
      );

      await this.classroomYearAssignmentRepository.insertMany(classroomYearTeachersData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.CLASSROOM_YEAR_STUDENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ResultRO,
      response: { resul: true },
      message: 'Bulk store classroom year assignment successfully',
      actorId,
    });
  }

  private async validateBulkStore(dto: ClassroomYearAssignmentBulkStoreDTO, actorId: number) {
    // Validate classroomYear exist
    const classroomYearCount = await this.classroomYearRepository.countByIds(dto.classroomYearIds);
    if (classroomYearCount !== dto.classroomYearIds.length) {
      const { code, status, message } = EXCEPTION.CLASSROOM_YEAR.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Validate teacherSubject exist
    const teacherSubjectCount = await this.teacherSubjectRepository.countByIds(dto.teacherSubjectIds);
    if (teacherSubjectCount !== dto.teacherSubjectIds.length) {
      const { code, status, message } = EXCEPTION.TEACHER_SUBJECT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Validate duplicate
    const duplicateCount = await this.classroomYearAssignmentRepository.countByClassroomYearIdsAndTeacherSubjectIds(
      dto.classroomYearIds,
      dto.teacherSubjectIds,
    );
    if (duplicateCount > 0) {
      const { code, status, message } = EXCEPTION.CLASSROOM_YEAR_ASSIGNMENT.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
