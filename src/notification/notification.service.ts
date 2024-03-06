import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { NotificationEntity } from './notification.entity';
import { UserNotificationEntity } from '../user-notification/user-notificaiton.entity';
import { NotificationRepository } from './notification.repository';
import { CourseRepository } from '../course/course.repository';
import { StudentRepository } from '../student/student.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { NotificationGetListDTO, NotificationStoreDTO } from './dto/notification.dto';
import { NotificationGetListRO, NotificationStoreRO } from './ro/notificaiton.ro';

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
          courseId: dto.courseId,
          createdBy: actorId,
        });
        const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

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

    try {
      const response = await this.notificationRepository.find(dto);

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
  }
}
