import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { paginate } from '../common/function/paginate';
import { NotificationEntity } from './notification.entity';
import { NotificationGetListDTO } from './dto/notification.dto';

@Injectable()
export class NotificationRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: NotificationEntity) {
    return transaction.insertInto('notification').values(entity).returning(['id', 'title', 'content', 'createdAt']).executeTakeFirst();
  }

  find(dto: NotificationGetListDTO) {
    const { courseId, userId, page, limit } = dto;

    const byCourse = Boolean(courseId);
    const byUser = Boolean(userId);

    const query = this.database
      .selectFrom('notification')
      .where('notification.deletedAt', 'is', null)
      .innerJoin('course', 'course.id', 'notification.courseId')
      .where('course.deletedAt', 'is', null)
      .$if(byCourse, (qb) => qb.where('notification.courseId', '=', courseId))
      .$if(byUser, (qb) =>
        qb
          .innerJoin('userNotification', 'userNotification.notificationId', 'notification.id')
          .where('userNotification.userId', '=', userId)
          .innerJoin('users', 'users.id', 'userNotification.userId')
          .where('users.deletedAt', 'is', null),
      )
      .select(['notification.id', 'notification.title', 'notification.content', 'notification.createdAt', 'course.name as courseName']);

    return paginate(query, { page, limit });
  }
}
