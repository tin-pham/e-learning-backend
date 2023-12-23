import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { StudentParentEntity } from './student-parent.entity';
import { ParentRepository } from '../parent/parent.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { StudentRepository } from '../student/student.repository';
import { StudentParentRepository } from './student-parent.repository';
import {
  StudentParentBulkDeleteDTO,
  StudentParentBulkStoreDTO,
} from './dto/student-parent.dto';
import { ResultRO } from 'src/common/ro/result.ro';

@Injectable()
export class StudentParentService extends BaseService {
  private readonly logger = new Logger(StudentParentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly parentRepository: ParentRepository,
    private readonly studentRepository: StudentRepository,
    private readonly studentParentRepository: StudentParentRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: StudentParentBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const studentParentsData = dto.parentIds.flatMap((parentId) =>
        dto.studentIds.map(
          (studentId) =>
            new StudentParentEntity({
              parentId,
              studentId,
            }),
        ),
      );
      await this.studentParentRepository.insertMultiple(studentParentsData);
    } catch (error) {
      const { code, status, message } =
        EXCEPTION.STUDENT_PARENT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Student parent stored successfully',
      actorId,
    });
  }

  async bulkDelete(dto: StudentParentBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.studentParentRepository.deleteMultiple(
        dto.studentIds,
        dto.parentIds,
      );
    } catch (error) {
      const { code, status, message } =
        EXCEPTION.STUDENT_PARENT.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Student parent deleted successfully',
      actorId,
    });
  }

  private async validateBulkStore(
    dto: StudentParentBulkStoreDTO,
    actorId: string,
  ) {
    // Check parent exists
    const parent = await this.parentRepository.countByIds(dto.parentIds);
    if (!parent) {
      const { code, status, message } = EXCEPTION.PARENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exists
    const studentCount = await this.studentRepository.countByIds(
      dto.studentIds,
    );
    if (!studentCount) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check studentParent unique
    const studentParentCount =
      await this.studentParentRepository.countByStudentIdsAndParentIds(
        dto.studentIds,
        dto.parentIds,
      );
    if (studentParentCount) {
      const { code, status, message } = EXCEPTION.STUDENT_PARENT.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(
    dto: StudentParentBulkDeleteDTO,
    actorId: string,
  ) {
    // Check parent exists
    const parent = await this.parentRepository.countByIds(dto.parentIds);
    if (!parent) {
      const { code, status, message } = EXCEPTION.PARENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exists
    const studentCount = await this.studentRepository.countByIds(
      dto.studentIds,
    );
    if (!studentCount) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check studentParent exist
    const studentParentCount =
      await this.studentParentRepository.countByStudentIdsAndParentIds(
        dto.studentIds,
        dto.parentIds,
      );
    if (!studentParentCount) {
      const { code, status, message } = EXCEPTION.STUDENT_PARENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
