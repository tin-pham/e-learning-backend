import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { AssignmentNotificationEntity } from './assignment-notification.entity';

@Injectable()
export class AssignmentNotificationRepository {
  insertWithTransaction(transaction: Transaction, entity: AssignmentNotificationEntity) {
    return transaction.insertInto('assignmentNotification').values(entity).execute();
  }
}
