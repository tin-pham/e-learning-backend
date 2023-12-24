import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ClassroomEntity } from './classroom.entity';
import { ClassroomRepository } from './classroom.repository';
import { GradeRepository } from '../grade/grade.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import {
  ClassroomGetListDTO,
  ClassroomStoreDTO,
  ClassroomUpdateDTO,
} from './dto/classroom.dto';
import {
  ClassroomDeleteRO,
  ClassroomGetListRO,
  ClassroomStoreRO,
  ClassroomUpdateRO,
} from './ro/classroom.ro';

@Injectable()
export class ClassroomService extends BaseService {
  private readonly logger = new Logger(ClassroomService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly classroomRepository: ClassroomRepository,
    private readonly gradeRepository: GradeRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: ClassroomStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new ClassroomStoreRO();

    try {
      const classroomData = new ClassroomEntity();
      classroomData.name = dto.name;
      classroomData.gradeId = dto.gradeId;

      const classroom = await this.classroomRepository.insert(classroomData);

      response.id = classroom.id;
      response.name = classroom.name;
      response.gradeId = classroom.gradeId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.CLASSROOM.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ClassroomStoreRO,
      response,
      message: 'Classroom stored successfully',
      actorId,
    });
  }

  async getList(dto: ClassroomGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.classroomRepository.find(dto);
      return this.success({ classRO: ClassroomGetListRO, response });
    } catch (error) {
      const { code, status, message } = EXCEPTION.CLASSROOM.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }
  }

  async update(id: string, dto: ClassroomUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new ClassroomUpdateRO();

    try {
      const classroomData = new ClassroomEntity();
      classroomData.updatedAt = new Date();
      classroomData.updatedBy = actorId;
      if (dto.name) {
        classroomData.name = dto.name;
      }

      if (dto.gradeId) {
        classroomData.gradeId = dto.gradeId;
      }

      const classroom = await this.classroomRepository.update(
        id,
        classroomData,
      );

      response.id = classroom.id;
      response.name = classroom.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.CLASSROOM.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ClassroomUpdateRO,
      response,
      message: 'Classroom updated successfully',
      actorId,
    });
  }

  async delete(id: string, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new ClassroomDeleteRO();

    try {
      const gradeData = new ClassroomEntity();
      gradeData.deletedAt = new Date();
      gradeData.deletedBy = actorId;
      await this.classroomRepository.delete(id, gradeData);

      response.id = id;
    } catch (error) {
      const { code, status, message } = EXCEPTION.CLASSROOM.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ClassroomDeleteRO,
      response,
      message: 'Classroom deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: ClassroomStoreDTO, actorId: string) {
    // Check name unique
    const classroomCount = await this.classroomRepository.countByName(dto.name);
    if (classroomCount) {
      const { code, status, message } = EXCEPTION.CLASSROOM.ALREADY_EXISTS;
      this.throwException({ code, status, message, actorId });
    }

    // Check grade exists
    const gradeCount = await this.gradeRepository.countById(dto.gradeId);
    if (!gradeCount) {
      const { code, status, message } = EXCEPTION.GRADE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(
    id: string,
    dto: ClassroomUpdateDTO,
    actorId: string,
  ) {
    // Check exist
    const classroomCount = await this.classroomRepository.countById(id);
    if (!classroomCount) {
      const { code, status, message } = EXCEPTION.CLASSROOM.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check name unique
    if (dto.name) {
      const duplicateNameCount =
        await this.classroomRepository.countByNameExceptId(dto.name, id);
      if (duplicateNameCount) {
        const { code, status, message } = EXCEPTION.CLASSROOM.ALREADY_EXISTS;
        this.throwException({ code, status, message, actorId });
      }
    }

    // Check grade exists
    if (dto.gradeId) {
      const gradeCount = await this.gradeRepository.countById(dto.gradeId);
      if (!gradeCount) {
        const { code, status, message } = EXCEPTION.GRADE.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateDelete(id: string, actorId: string) {
    // Check exist
    const classroom = await this.classroomRepository.countById(id);
    if (!classroom) {
      const { code, status, message } = EXCEPTION.CLASSROOM.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
