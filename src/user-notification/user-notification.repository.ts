import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { UserNotificationEntity } from './user-notificaiton.entity';

@Injectable()
export class UserNotificationRepository {
  insertMultipleWithTransaction(transaction: Transaction, entities: UserNotificationEntity[]) {
    return transaction.insertInto('userNotification').values(entities).execute();
  }
}
