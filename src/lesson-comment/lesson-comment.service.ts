import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonCommentEntity } from './lesson-comment.entity';
import { LessonCommentRepository } from './lesson-comment.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonCommentGetListDTO, LessonCommentStoreDTO, LessonCommentUpdateDTO } from './dto/lesson-comment.dto';
import {
  LessonCommentDeleteRO,
  LessonCommentGetDetailRO,
  LessonCommentGetListRO,
  LessonCommentStoreRO,
  LessonCommentUpdateRO,
} from './ro/lesson-comment.ro';

@Injectable()
export class LessonCommentService extends BaseService {
  private readonly logger = new Logger(LessonCommentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly lessonRepository: LessonRepository,
    private readonly lessonCommentRepository: LessonCommentRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: LessonCommentStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);
    let response: LessonCommentStoreRO;
    try {
      const lessonCommentData = new LessonCommentEntity({
        lessonId: dto.lessonId,
        body: dto.body,
        parentId: dto.parentId,
      });

      const lesson = await this.lessonCommentRepository.insert(lessonCommentData, actorId);

      response = new LessonCommentStoreRO({
        id: lesson.id,
        lessonId: lesson.lessonId,
        body: lesson.body,
        parentId: lesson.parentId,
        createdBy: lesson.createdBy,
        userId: lesson.userId,
        userDisplayName: lesson.userDisplayName,
        createdAt: lesson.createdAt,
        userImageUrl: lesson.userImageUrl,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonCommentStoreRO,
      response,
      message: 'Lesson comment has been stored successfully',
      actorId,
    });
  }

  async getList(dto: LessonCommentGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.lessonCommentRepository.find(dto);

      return this.success({
        classRO: LessonCommentGetListRO,
        response,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let lesson: LessonCommentEntity;

    try {
      lesson = await this.lessonCommentRepository.findOneById(id);
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    if (!lesson) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.NOT_FOUND;
      this.throwException({ status, message, code, actorId });
    }

    const response = new LessonCommentGetDetailRO({
      id: lesson.id,
      lessonId: lesson.lessonId,
      body: lesson.body,
      parentId: lesson.parentId,
      createdBy: lesson.createdBy,
    });

    return this.success({
      classRO: LessonCommentGetDetailRO,
      response,
    });
  }

  async update(id: number, dto: LessonCommentUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, actorId);

    let response: LessonCommentUpdateRO;

    try {
      const lessonCommentData = new LessonCommentEntity({
        body: dto.body,
      });

      const lesson = await this.lessonCommentRepository.update(id, lessonCommentData, actorId);

      response = new LessonCommentUpdateRO({
        id: lesson.id,
        body: lesson.body,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonCommentUpdateRO,
      response,
      message: 'Lesson comment has been updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    let response: LessonCommentDeleteRO;

    try {
      const lessonComment = await this.lessonCommentRepository.delete(id, actorId);

      response = new LessonCommentDeleteRO({
        id: lessonComment.id,
      });
    } catch (error) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ status, message, code, actorId });
    }

    return this.success({
      classRO: LessonCommentDeleteRO,
      response,
      message: 'Lesson comment has been deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: LessonCommentStoreDTO, actorId: number) {
    // Check if lesson exists
    const lessonCount = await this.lessonRepository.countById(dto.lessonId);
    if (!lessonCount) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // Check if parent comment exist
    if (dto.parentId) {
      const commentCount = await this.lessonCommentRepository.countById(dto.parentId);
      if (!commentCount) {
        const { status, message, code } = EXCEPTION.LESSON_COMMENT.DOES_NOT_EXIST;
        this.throwException({ status, message, code, actorId });
      }
    }
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check exist
    const commentCount = await this.lessonCommentRepository.countById(id);
    if (!commentCount) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    const commentCount = await this.lessonCommentRepository.countById(id);
    if (!commentCount) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
