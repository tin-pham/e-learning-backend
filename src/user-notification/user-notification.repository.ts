import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { UserNotificationEntity } from './user-notification.entity';

@Injectable()
export class UserNotificationRepository {
  constructor(private readonly database: DatabaseService) {}

  updateByUserId(userId: number, entity: Partial<UserNotificationEntity>) {
    return this.database
      .updateTable('userNotification')
      .set(entity)
      .where('userId', '=', userId)
      .where('deletedAt', 'is', null)
      .where('isRead', '!=', true)
      .execute();
  }

  findUnreadByUserId(userId: number) {
    return this.database
      .selectFrom('userNotification')
      .where('userId', '=', userId)
      .where('isRead', '=', false)
      .where('deletedAt', 'is', null)
      .execute();
  }

  deleteByNotificationIds(notificationIds: number[]) {
    return this.database.deleteFrom('userNotification').where('notificationId', 'in', notificationIds).execute();
  }

  updateByNotificationIds(notificationIds: number[], entity: UserNotificationEntity) {
    return this.database.updateTable('userNotification').set(entity).where('notificationId', 'in', notificationIds).execute();
  }

  insertMultipleWithTransaction(transaction: Transaction, entities: UserNotificationEntity[]) {
    return transaction.insertInto('userNotification').values(entities).execute();
  }

  insertWithTransaction(transaction: Transaction, entity: UserNotificationEntity) {
    return transaction.insertInto('userNotification').values(entity).execute();
  }
}
