import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ClassroomYearRepository } from './classroom-year.repository';
import { TeacherRepository } from '../teacher/teacher.repository';
import { ClassroomYearUpdateDTO } from './dto/classroom-year.dto';
import { ClassroomYearEntity } from './classroom-year.entity';
import { ClassroomYearGetDetailRO, ClassroomYearUpdateRO } from './ro/classroom-year.ro';

@Injectable()
export class ClassroomYearService extends BaseService {
  private readonly logger = new Logger(ClassroomYearService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly classroomYearRepository: ClassroomYearRepository,
    private readonly teacherRepository: TeacherRepository,
  ) {
    super(elasticLogger);
  }

  async update(id: number, dto: ClassroomYearUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new ClassroomYearUpdateRO();

    try {
      const classroomYearData = new ClassroomYearEntity();
      if (dto.formTeacherId) {
        classroomYearData.formTeacherId = dto.formTeacherId;
      }

      const classroomYear = await this.classroomYearRepository.update(id, classroomYearData);

      response.id = classroomYear.id;
      response.formTeacherId = classroomYear.formTeacherId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.CLASSROOM_YEAR.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ClassroomYearUpdateRO,
      response,
      message: 'Update classroom year successfully',
      actorId,
    });
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const classroomYear = await this.classroomYearRepository.findOneById(id);

      if (!classroomYear) {
        const { code, status, message } = EXCEPTION.CLASSROOM_YEAR.NOT_FOUND;
        this.throwException({ code, status, message, actorId });
      }

      return this.success({
        classRO: ClassroomYearGetDetailRO,
        response: classroomYear,
        message: 'Get classroom year detail successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.CLASSROOM_YEAR.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: ClassroomYearUpdateDTO, actorId: number) {
    // Check exist
    const classroomYearCount = await this.classroomYearRepository.countById(id);
    if (!classroomYearCount) {
      const { code, status, message } = EXCEPTION.CLASSROOM_YEAR.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check form teacher exist
    const teacherCount = await this.teacherRepository.countById(dto.formTeacherId);
    if (!teacherCount) {
      const { code, status, message } = EXCEPTION.TEACHER.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check unique form teacher
    if (dto.formTeacherId) {
      const formTeacherCount = await this.classroomYearRepository.countByFormTeacherIdExceptId(dto.formTeacherId, id);
      if (formTeacherCount > 0) {
        const { code, status, message } = EXCEPTION.CLASSROOM_YEAR.FORM_TEACHER_ALREADY_ASSIGNED;
        this.throwException({ code, status, message, actorId });
      }
    }
  }
}
