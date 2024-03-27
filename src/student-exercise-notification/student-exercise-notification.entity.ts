import { BaseEntity } from '../base/base.entity';

export class StudentExerciseNotificationEntity extends BaseEntity {
  studentExerciseId: number;
  notificationId: number;

  constructor(data?: StudentExerciseNotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
