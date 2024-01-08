import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { TeacherSubjectRepository } from './teacher-subject.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { TeacherRepository } from '../teacher/teacher.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { TeacherSubjectBulkStoreDTO, TeacherSubjectGetListDTO } from './dto/teacher-subject.dto';
import { TeacherSubjectEntity } from './teacher-subject.entity';
import { ResultRO } from '../common/ro/result.ro';
import { TeacherSubjectGetListRO } from './ro/teacher-subject.ro';

@Injectable()
export class TeacherSubjectService extends BaseService {
  private readonly logger = new Logger(TeacherSubjectService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly teacherRepository: TeacherRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly teacherSubjectRepository: TeacherSubjectRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: TeacherSubjectBulkStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const teacherSubjectsData = dto.teacherIds.flatMap((teacherId) =>
        dto.subjectIds.map(
          (subjectId) =>
            new TeacherSubjectEntity({
              teacherId,
              subjectId,
              createdBy: actorId,
            }),
        ),
      );
      await this.teacherSubjectRepository.insertMany(teacherSubjectsData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER_SUBJECT.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Teacher subject stored successfully',
      actorId,
    });
  }

  async getList(dto: TeacherSubjectGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.teacherSubjectRepository.find(dto);
      return this.success({
        classRO: TeacherSubjectGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER_SUBJECT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkStore(dto: TeacherSubjectBulkStoreDTO, actorId: number) {
    // Check teachers exists
    const teacherCount = await this.teacherRepository.countByIds(dto.teacherIds);
    if (teacherCount !== dto.teacherIds.length) {
      const { code, status, message } = EXCEPTION.TEACHER.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check subjects exists
    const subjectCount = await this.subjectRepository.countByIds(dto.subjectIds);
    if (subjectCount !== dto.subjectIds.length) {
      const { code, status, message } = EXCEPTION.SUBJECT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check duplicate
    const teacherSubjectCount = await this.teacherSubjectRepository.countByTeacherIdsAndSubjectIds(dto.teacherIds, dto.subjectIds);
    if (teacherSubjectCount > 0) {
      const { code, status, message } = EXCEPTION.TEACHER_SUBJECT.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
