import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { LessonNotificationEntity } from './lesson-notification.entity';

@Injectable()
export class LessonNotificationRepository {
  insertWithTransaction(transaction: Transaction, entity: LessonNotificationEntity) {
    return transaction.insertInto('lessonNotification').values(entity).execute();
  }
}
