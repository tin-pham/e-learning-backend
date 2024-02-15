import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { SectionEntity } from './section.entity';
import { SectionRepository } from './section.repository';
import { CourseRepository } from '../course/course.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { SectionGetDetailDTO, SectionGetListDTO, SectionStoreDTO, SectionUpdateDTO } from './dto/section.dto';
import { SectionDeleteRO, SectionGetDetailRO, SectionGetListRO, SectionStoreRO, SectionUpdateRO } from './ro/section.ro';
import { DatabaseService } from '../database';
import { LessonRepository } from 'src/lesson/lesson.repository';

@Injectable()
export class SectionService extends BaseService {
  private readonly logger = new Logger(SectionService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly sectionRepository: SectionRepository,
    private readonly courseRepository: CourseRepository,
    private readonly lessonReposisotry: LessonRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: SectionStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new SectionStoreRO();

    try {
      const sectionData = new SectionEntity();
      sectionData.name = dto.name;
      sectionData.courseId = dto.courseId;
      sectionData.createdBy = actorId;

      const section = await this.sectionRepository.insert(sectionData);

      response.id = section.id;
      response.name = section.name;
      response.courseId = section.courseId;
    } catch (error) {
      const { code, status, message } = EXCEPTION.SECTION.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: SectionStoreRO,
      response,
      message: 'Store section successfully',
      actorId,
    });
  }

  async getList(dto: SectionGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.sectionRepository.find(dto);

      return this.success({
        classRO: SectionGetListRO,
        response,
        message: 'Get list section successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.SECTION.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, dto: SectionGetDetailDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let response: any;
    try {
      response = await this.sectionRepository.findOneById(id, dto);
    } catch (error) {
      const { code, status, message } = EXCEPTION.SECTION.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!response) {
      const { code, status, message } = EXCEPTION.SECTION.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: SectionGetDetailRO,
      response,
      message: 'Get section detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: SectionUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

    const response = new SectionUpdateRO();

    try {
      const sectionData = new SectionEntity();
      sectionData.updatedBy = actorId;
      sectionData.updatedAt = new Date();
      if (dto.name) {
        sectionData.name = dto.name;
      }

      const section = await this.sectionRepository.update(id, sectionData);

      response.id = section.id;
      response.name = section.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.SECTION.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: SectionUpdateRO,
      response,
      message: 'Update section successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new SectionDeleteRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Delete section
        const section = await this.sectionRepository.deleteWithTransaction(transaction, id, actorId);

        // Delete lesson
        await this.lessonReposisotry.deleteMultipleBySectionIdWithTransaction(transaction, section.id, actorId);

        response.id = section.id;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.SECTION.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: SectionDeleteRO,
      response,
      message: 'Delete section successfully',
      actorId,
    });
  }

  private async validateStore(dto: SectionStoreDTO, actorId: number) {
    // Check name exist
    const nameCount = await this.sectionRepository.countByName(dto.name);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.SECTION.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check course exist
    const courseCount = await this.courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, dto: SectionUpdateDTO, actorId: number) {
    // Check exist
    const sectionCount = await this.sectionRepository.countById(id);
    if (!sectionCount) {
      const { code, status, message } = EXCEPTION.SECTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check name exist except id
    const nameCount = await this.sectionRepository.countByNameExceptId(dto.name, id);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.SECTION.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const sectionCount = await this.sectionRepository.countById(id);
    if (!sectionCount) {
      const { code, status, message } = EXCEPTION.SECTION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
