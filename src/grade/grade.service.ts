import { Injectable, Logger } from '@nestjs/common';
import { GradeRepository } from './grade.repository';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { GradeEntity } from './grade.entity';
import { ElasticsearchLoggerService } from 'src/elastic-search-logger/elastic-search-logger.service';
import {
  GradeGetListDTO,
  GradeStoreDTO,
  GradeUpdateDTO,
} from './dto/grade.dto';
import {
  GradeDeleteRO,
  GradeGetListRO,
  GradeStoreRO,
  GradeUpdateRO,
} from './ro/grade.ro';

@Injectable()
export class GradeService extends BaseService {
  private readonly logger = new Logger(GradeService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly gradeRepository: GradeRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: GradeStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new GradeStoreRO();

    try {
      const gradeData = new GradeEntity();
      gradeData.name = dto.name;
      gradeData.createdBy = actorId;

      const grade = await this.gradeRepository.insert(gradeData);

      response.id = grade.id;
      response.name = grade.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.GRADE.STORE_FAILED;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: GradeStoreRO,
      response,
      message: 'Grade stored successfully',
      actorId,
    });
  }

  async getList(dto: GradeGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.gradeRepository.find(dto);
      return this.success({ classRO: GradeGetListRO, response });
    } catch (error) {
      const { code, status, message } = EXCEPTION.GRADE.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }
  }

  async update(id: string, dto: GradeUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new GradeUpdateRO();

    try {
      const gradeData = new GradeEntity();
      gradeData.updatedAt = new Date();
      gradeData.updatedBy = actorId;
      if (dto.name) {
        gradeData.name = dto.name;
      }

      const grade = await this.gradeRepository.update(id, gradeData);

      response.id = grade.id;
      response.name = grade.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.GRADE.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: GradeUpdateRO,
      response,
      message: 'Grade updated successfully',
      actorId,
    });
  }

  async delete(id: string, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new GradeDeleteRO();

    try {
      const gradeData = new GradeEntity();
      gradeData.deletedAt = new Date();
      gradeData.deletedBy = actorId;
      await this.gradeRepository.delete(id, gradeData);

      response.id = id;
    } catch (error) {
      const { code, status, message } = EXCEPTION.GRADE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: GradeDeleteRO,
      response,
      message: 'Grade deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: GradeStoreDTO, actorId: string) {
    // Check name unique
    const exists = await this.gradeRepository.countByName(dto.name);
    if (exists) {
      const { code, status, message } = EXCEPTION.GRADE.ALREADY_EXISTS;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(
    id: string,
    dto: GradeUpdateDTO,
    actorId: string,
  ) {
    // Check exist
    const gradeCount = await this.gradeRepository.countById(id);
    if (!gradeCount) {
      const { code, status, message } = EXCEPTION.GRADE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check name unique
    if (dto.name) {
      const duplicateNameCount = await this.gradeRepository.countByNameExceptId(
        dto.name,
        id,
      );
      if (duplicateNameCount) {
        const { code, status, message } = EXCEPTION.GRADE.ALREADY_EXISTS;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateDelete(id: string, actorId: string) {
    // Check exist
    const grade = await this.gradeRepository.countById(id);
    if (!grade) {
      const { code, status, message } = EXCEPTION.GRADE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
