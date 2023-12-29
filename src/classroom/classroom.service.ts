import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ClassroomEntity } from './classroom.entity';
import { ClassroomRepository } from './classroom.repository';
import { GradeRepository } from '../grade/grade.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ClassroomGetListDTO, ClassroomStoreDTO } from './dto/classroom.dto';
import {
  ClassroomDeleteRO,
  ClassroomGetListRO,
  ClassroomStoreRO,
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
      classroomData.gradeId = dto.gradeId;

      // Get last classroom name
      const { name } = await this.classroomRepository.getLastInsertedName();

      // Set classroom name
      if (!name) {
        classroomData.name = 'A';
      } else {
        const letter = name.charAt(0);
        const number = parseInt(name.slice(1));

        // Increment number
        const nextNumber = number + 1;

        // If number reaches 10, increment letter and reset number
        classroomData.name =
          nextNumber > 10
            ? String.fromCharCode(letter.charCodeAt(0) + 1) + '1'
            : letter + nextNumber;
      }

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
    // Check grade exists
    const gradeCount = await this.gradeRepository.countById(dto.gradeId);
    if (!gradeCount) {
      const { code, status, message } = EXCEPTION.GRADE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
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
