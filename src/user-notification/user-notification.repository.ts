import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { UserNotificationEntity } from './user-notification.entity';

@Injectable()
export class UserNotificationRepository {
  constructor(private readonly database: DatabaseService) {}

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
