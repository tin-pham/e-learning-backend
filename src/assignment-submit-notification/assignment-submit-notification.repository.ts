import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { AssignmentSubmitNotificationEntity } from './assignment-submit-notification.entity';

@Injectable()
export class AssignmentSubmitNotificationRepository {
  insertWithTransaction(transaction: Transaction, entity: AssignmentSubmitNotificationEntity) {
    return transaction.insertInto('assignmentSubmitNotification').values(entity).execute();
  }
}
