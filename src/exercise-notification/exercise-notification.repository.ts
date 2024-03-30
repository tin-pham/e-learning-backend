import { Injectable } from '@nestjs/common';
import { ExerciseNotificationEntity } from './exercise-notification.entity';
import { Transaction } from '../database';

@Injectable()
export class ExerciseNotificationRepository {
  insertWithTransaction(transaction: Transaction, entity: ExerciseNotificationEntity) {
    return transaction.insertInto('exerciseNotification').values(entity).execute();
  }
}
