import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { LessonCommentEntity } from './lesson-comment.entity';
import { CommentNotificationEntity } from '../comment-notification/comment-notification.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { UserNotificationEntity } from '../user-notification/user-notificaiton.entity';
import { LessonCommentRepository } from './lesson-comment.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { CommentNotificationRepository } from '../comment-notification/comment-notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
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
    private readonly database: DatabaseService,
    private readonly lessonRepository: LessonRepository,
    private readonly lessonCommentRepository: LessonCommentRepository,
    private readonly commentNotificationRepository: CommentNotificationRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: LessonCommentStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { lesson, parentComment } = await this.validateStore(dto, actorId);
    let response: LessonCommentStoreRO;
    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store comment
        const lessonCommentData = new LessonCommentEntity({
          lessonId: dto.lessonId,
          body: dto.body,
          parentId: dto.parentId,
        });
        const comment = await this.lessonCommentRepository.insertWithTransaction(transaction, lessonCommentData, actorId);

        // Notify
        let notificationData: NotificationEntity;
        const userNotificationData = new UserNotificationEntity();

        if (dto.parentId && parentComment.createdBy !== comment.createdBy) {
          notificationData = new NotificationEntity({
            title: 'Phản hồi mới',
            content: `${dto.body}`,
          });
          userNotificationData.userId = parentComment.createdBy;
        } else if (dto.lessonId && lesson.createdBy !== comment.createdBy) {
          notificationData = new NotificationEntity({
            title: 'Bình luận mới',
            content: `${dto.body}`,
          });
          userNotificationData.userId = lesson.createdBy;
        }

        if (notificationData && userNotificationData) {
          const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

          const commentNotificationData = new CommentNotificationEntity({
            commentId: comment.id,
            notificationId: notification.id,
          });
          await this.commentNotificationRepository.insertWithTransaction(transaction, commentNotificationData);

          userNotificationData.notificationId = notification.id;
          await this.userNotificationRepository.insertWithTransaction(transaction, userNotificationData);
        }

        response = new LessonCommentStoreRO({
          id: comment.id,
          lessonId: comment.lessonId,
          body: comment.body,
          parentId: comment.parentId,
          createdBy: comment.createdBy,
          userId: comment.userId,
          userDisplayName: comment.userDisplayName,
          createdAt: comment.createdAt,
          userImageUrl: comment.userImageUrl,
        });
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

    let lesson: LessonCommentGetDetailRO;

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
      body: lesson.body,
      createdAt: lesson.createdAt,
      createdBy: lesson.createdBy,
      lessonId: lesson.lessonId,
      parentId: lesson.parentId,
      userId: lesson.userId,
      userDisplayName: lesson.userDisplayName,
      userImageUrl: lesson.userImageUrl,
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
    const lesson = await this.lessonRepository.findOneById(dto.lessonId);
    if (!lesson) {
      const { status, message, code } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // Check if parent comment exist
    let parentComment;
    if (dto.parentId) {
      parentComment = await this.lessonCommentRepository.getCreatedByById(dto.parentId);
      if (!parentComment) {
        const { status, message, code } = EXCEPTION.LESSON_COMMENT.DOES_NOT_EXIST;
        this.throwException({ status, message, code, actorId });
      }
    }

    return { lesson, parentComment };
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check exist
    const commentCount = await this.lessonCommentRepository.countById(id);
    if (!commentCount) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // Check actor is owner
    const commentCountByIdAndCreatedBy = await this.lessonCommentRepository.countByIdAndCreatedBy(id, actorId);
    if (!commentCountByIdAndCreatedBy) {
      const { status, message, code } = EXCEPTION.LESSON_COMMENT.NOT_OWNER;
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
