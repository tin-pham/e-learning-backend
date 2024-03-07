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

  findByCourseId(dto: NotificationGetListDTO, actorId: number) {
    const { courseId, page, limit } = dto;

    const byUser = Boolean(actorId);

    const query = this.database
      .selectFrom('notification')
      .where('notification.deletedAt', 'is', null)
      .innerJoin('courseNotification', 'courseNotification.notificationId', 'notification.id')
      .where('courseNotification.courseId', '=', courseId)
      .where('courseNotification.deletedAt', 'is', null)
      .innerJoin('course', 'course.id', 'courseNotification.courseId')
      .where('course.deletedAt', 'is', null)
      .$if(byUser, (qb) =>
        qb
          .innerJoin('userNotification', 'userNotification.notificationId', 'notification.id')
          .where('userNotification.deletedAt', 'is', null)
          .innerJoin('users', 'users.id', 'userNotification.userId')
          .where('users.deletedAt', 'is', null)
          .where('users.id', '=', actorId)
          .select(['userNotification.isRead']),
      )
      .select([
        'notification.id',
        'notification.title',
        'notification.content',
        'notification.createdAt',
        'course.id as courseId',
        'course.name as courseName',
      ]);

    return paginate(query, { page, limit });
  }

  findByUserId(userId: number, dto: NotificationGetListDTO) {
    const { page, limit } = dto;

    const query = this.database
      .selectFrom('notification')
      .where('notification.deletedAt', 'is', null)
      .leftJoin('courseNotification', (join) =>
        join.onRef('courseNotification.notificationId', '=', 'notification.id').on('courseNotification.deletedAt', 'is', null),
      )
      .leftJoin('course', (join) => join.onRef('course.id', '=', 'courseNotification.courseId').on('course.deletedAt', 'is', null))
      .leftJoin('commentNotification', (join) =>
        join.onRef('commentNotification.notificationId', '=', 'notification.id').on('commentNotification.deletedAt', 'is', null),
      )
      .leftJoin('lessonComment', (join) =>
        join.onRef('lessonComment.id', '=', 'commentNotification.commentId').on('lessonComment.deletedAt', 'is', null),
      )
      .leftJoin('users as commentOwner', (join) =>
        join.onRef('commentOwner.id', '=', 'lessonComment.createdBy').on('commentOwner.deletedAt', 'is', null),
      )
      .leftJoin('userImage', (join) => join.onRef('userImage.userId', '=', 'commentOwner.id').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('image.id', '=', 'userImage.imageId').on('image.deletedAt', 'is', null))
      .innerJoin('userNotification', 'userNotification.notificationId', 'notification.id')
      .where('userNotification.userId', '=', userId)
      .where('userNotification.deletedAt', 'is', null)
      .innerJoin('users', 'users.id', 'userNotification.userId')
      .where('users.deletedAt', 'is', null)
      .select([
        'notification.id',
        'notification.title',
        'notification.content',
        'notification.createdAt',
        'course.id as courseId',
        'course.name as courseName',
        'lessonComment.id as commentId',
        'commentOwner.displayName as commentOwnerDisplayName',
        'image.url as commentOwnerImageUrl',
      ]);

    return paginate(query, { page, limit });
  }
}
