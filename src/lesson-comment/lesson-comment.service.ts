import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LessonCommentEntity } from './lesson-comment.entity';
import { LessonCommentRepository } from './lesson-comment.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LessonCommentGetListDTO, LessonCommentStoreDTO } from './dto/lesson-comment.dto';
import { LessonCommentGetDetailRO, LessonCommentGetListRO, LessonCommentStoreRO } from './ro/lesson-comment.ro';

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
        userId: actorId,
        body: dto.body,
        parentId: dto.parentId,
      });

      const lesson = await this.lessonCommentRepository.insert(lessonCommentData);

      response = new LessonCommentStoreRO({
        id: lesson.id,
        lessonId: lesson.lessonId,
        userId: lesson.userId,
        body: lesson.body,
        parentId: lesson.parentId,
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

    if (lesson) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.NOT_FOUND;
      this.throwException({ status, message, code, actorId });
    }

    const response = new LessonCommentGetDetailRO({
      id: lesson.id,
      lessonId: lesson.lessonId,
      userId: lesson.userId,
      body: lesson.body,
      parentId: lesson.parentId,
    });

    return this.success({
      classRO: LessonCommentGetDetailRO,
      response,
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
    const commentCount = await this.lessonCommentRepository.countById(dto.parentId);
    if (!commentCount) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }
  }
}
