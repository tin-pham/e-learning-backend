import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonEntity } from './lesson.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonGetListDTO, LessonStoreDTO, LessonUpdateDTO } from './dto/lesson.dto';
import { LessonRepository } from './lesson.repository';
import { LessonDeleteRO, LessonGetDetailRO, LessonGetListRO, LessonStoreRO, LessonUpdateRO } from './ro/lesson.ro';

@Injectable()
export class LessonService extends BaseService {
  private readonly logger = new Logger(LessonService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly lessonRepository: LessonRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: LessonStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const response = new LessonStoreRO();

    try {
      const lessonData = new LessonEntity({
        title: dto.title,
        body: dto.body,
        createdBy: actorId,
      });

      const lesson = await this.lessonRepository.insert(lessonData);

      response.id = lesson.id;
      response.title = lesson.title;
      response.body = lesson.body;
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonStoreRO,
      response,
      message: 'Lesson has been stored successfully',
      actorId,
    });
  }

  async getList(dto: LessonGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = await this.lessonRepository.find(dto);

      return this.success({
        classRO: LessonGetListRO,
        response,
        message: 'Get lesson list successfully',
        actorId,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let lesson: LessonEntity;

    try {
      lesson = await this.lessonRepository.findOneById(id);
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    if (!lesson) {
      const { status, message, code } = EXCEPTION.LESSON.NOT_FOUND;
      this.throwException({ status, message, code, actorId });
    }

    const response = new LessonGetDetailRO();
    response.id = lesson.id;
    response.body = lesson.body;
    response.title = lesson.title;

    return this.success({
      classRO: LessonGetDetailRO,
      response,
      message: 'Get lesson detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: LessonUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, actorId);

    const response = new LessonUpdateRO();

    try {
      const lessonData = new LessonEntity();
      lessonData.updatedBy = actorId;
      if (dto.title) {
        lessonData.title = dto.title;
      }

      if (dto.body) {
        lessonData.body = dto.body;
      }

      const lesson = await this.lessonRepository.update(id, lessonData);

      response.id = lesson.id;
      response.title = lesson.title;
      response.body = lesson.body;
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonUpdateRO,
      response,
      message: 'Lesson has been updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new LessonDeleteRO();

    try {
      const lesson = await this.lessonRepository.delete(id, actorId);

      response.id = lesson.id;
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonDeleteRO,
      response,
      message: 'Lesson has been deleted successfully',
      actorId,
    });
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check exist
    const lessonCount = await this.lessonRepository.countById(id);
    if (!lessonCount) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const lessonCount = await this.lessonRepository.countById(id);
    if (!lessonCount) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
