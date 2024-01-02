import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ClassroomYearStudentEntity } from './classroom-year-student.entity';
import { ClassroomYearRepository } from '../classroom-year/classroom-year.repository';
import { StudentRepository } from '../student/student.repository';
import { ClassroomYearStudentRepository } from './classroom-year-student.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ClassroomYearStudentBulkStoreDTO } from './dto/classroom-year-student.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class ClassroomYearStudentService extends BaseService {
  private readonly logger = new Logger(ClassroomYearStudentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly classroomYearRepository: ClassroomYearRepository,
    private readonly studentRepository: StudentRepository,
    private readonly classroomYearStudentRepository: ClassroomYearStudentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: ClassroomYearStudentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const classroomYearStudentData = dto.classroomYearIds.flatMap(
        (classroomYearId) =>
          dto.studentIds.map(
            (studentId) =>
              new ClassroomYearStudentEntity({
                classroomYearId,
                studentId,
                createdBy: actorId,
              }),
          ),
      );
      await this.classroomYearStudentRepository.insertMany(
        classroomYearStudentData,
      );
    } catch (error) {
      const { code, status, message } =
        EXCEPTION.CLASSROOM_YEAR_STUDENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Classroom year student stored successfully',
      actorId,
    });
  }

  private async validateBulkStore(
    dto: ClassroomYearStudentBulkStoreDTO,
    actorId: string,
  ) {
    // Check classroomYear exist
    const classroomYearCount = await this.classroomYearRepository.countByIds(
      dto.classroomYearIds,
    );
    if (classroomYearCount !== dto.classroomYearIds.length) {
      const { code, status, message } = EXCEPTION.CLASSROOM_YEAR.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exist
    const studentCount = await this.studentRepository.countByIds(
      dto.studentIds,
    );
    if (studentCount !== dto.studentIds.length) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check duplicate
    const classroomYearStudentCount =
      await this.classroomYearStudentRepository.countByClassroomYearIdsAndStudentIds(
        dto.classroomYearIds,
        dto.studentIds,
      );
    if (classroomYearStudentCount > 0) {
      const { code, status, message } =
        EXCEPTION.CLASSROOM_YEAR_STUDENT.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
