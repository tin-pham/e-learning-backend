import { Injectable } from '@nestjs/common';
import { CourseNotificationEntity } from './course-notification.entity';
import { Transaction } from '../database';

@Injectable()
export class CourseNotificationRepository {
  insertWithTransaction(transaction: Transaction, entity: CourseNotificationEntity) {
    return transaction.insertInto('courseNotification').values(entity).execute();
  }
}
