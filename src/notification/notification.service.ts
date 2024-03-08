import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { NotificationEntity } from './notification.entity';
import { UserNotificationEntity } from '../user-notification/user-notification.entity';
import { NotificationRepository } from './notification.repository';
import { CourseRepository } from '../course/course.repository';
import { StudentRepository } from '../student/student.repository';
import { UserRepository } from '../user/user.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { CommentNotificationRepository } from '../comment-notification/comment-notification.repository';
import { LessonCommentRepository } from '../lesson-comment/lesson-comment.repository';
import { NotificationGetListDTO, NotificationStoreDTO } from './dto/notification.dto';
import { NotificationGetListRO, NotificationStoreRO } from './ro/notification.ro';

@Injectable()
export class NotificationService extends BaseService {
  private readonly logger = new Logger(NotificationService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly notificationRepository: NotificationRepository,
    private readonly courseRepository: CourseRepository,
    private readonly courseStudentRepository: CourseStudentRepository,
    private readonly studentRepository: StudentRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
    private readonly userRepository: UserRepository,
    private readonly courseNotificationRepository: CourseNotificationRepository,
    private readonly commentNotificationRepository: CommentNotificationRepository,
    private readonly lessonCommentRepository: LessonCommentRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: NotificationStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    const response = new NotificationStoreRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store notification
        const notificationData = new NotificationEntity({
          title: dto.title,
          content: dto.content,
          createdBy: actorId,
        });
        const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

        // Store course notification
        if (dto.courseId) {
          await this.courseNotificationRepository.insertWithTransaction(transaction, {
            courseId: dto.courseId,
            notificationId: notification.id,
          });
          // Store user notification
          const courseStudents = await this.courseStudentRepository.getStudentIdsByCourseId(dto.courseId);

          let users: { id: number }[] = [];
          if (courseStudents.length) {
            const studentIds = courseStudents.map((courseStudent) => courseStudent.studentId);
            users = await this.studentRepository.getUserIdsByStudentIds(studentIds);

            const userNotificationData = users.map(
              (user) =>
                new UserNotificationEntity({
                  userId: user.id,
                  notificationId: notificationData.id,
                }),
            );
            await this.userNotificationRepository.insertMultipleWithTransaction(transaction, userNotificationData);
          }
        }

        // By comment
        if (dto.commentId) {
          await this.commentNotificationRepository.insertWithTransaction(transaction, {
            commentId: dto.commentId,
            notificationId: notification.id,
          });

          const comment = await this.lessonCommentRepository.getUserIdById(dto.commentId);
          if (comment) {
            await this.userNotificationRepository.insertWithTransaction(transaction, {
              userId: comment.userId,
              notificationId: notification.id,
            });
          }
        }

        response.id = notification.id;
        response.title = notification.title;
        response.content = notification.content;
        response.createdAt = notification.createdAt;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.NOTIFICATION.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: NotificationStoreRO,
      response,
      message: 'Notification created successfully',
      actorId,
    });
  }

  async getList(dto: NotificationGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    console.log(dto);

    try {
      let response;
      if (dto.courseId) {
        console.log('hey');
        response = await this.notificationRepository.findByCourseId(dto, actorId);
      } else if (dto.byUser) {
        console.log('hey2');
        response = await this.notificationRepository.findByUserId(actorId, dto);
      }
      console.log(response);

      return this.success({
        classRO: NotificationGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.NOTIFICATION.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateStore(dto: NotificationStoreDTO, actorId: number) {
    // Check course exist
    const courseCount = await this.courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check user exist
    const userCount = await this.userRepository.countById(actorId);
    if (!userCount) {
      const { code, status, message } = EXCEPTION.USER.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
