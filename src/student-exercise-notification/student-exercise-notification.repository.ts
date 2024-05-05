import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { StudentExerciseNotificationEntity } from './student-exercise-notification.entity';

@Injectable()
export class StudentExerciseNotificationRepository {
  insertMultipleWithTransaction(transaction: Transaction, entities: StudentExerciseNotificationEntity[]) {
    return transaction.insertInto('studentExerciseNotification').values(entities).execute();
  }

  deleteByStudentExerciseIdWithTransaction(transaction: Transaction, studentExerciseId: number) {
    return transaction
      .deleteFrom('studentExerciseNotification')
      .where('studentExerciseId', '=', studentExerciseId)
      .where('deletedAt', 'is', null)
      .returning(['notificationId'])
      .execute();
  }
}
