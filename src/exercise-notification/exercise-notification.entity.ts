import { BaseEntity } from '../base/base.entity';

export class ExerciseNotificationEntity extends BaseEntity {
  exerciseId: number;
  notificationId: number;

  constructor(data?: ExerciseNotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
