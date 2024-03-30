import { BaseEntity } from '../base/base.entity';

export class LessonNotificationEntity extends BaseEntity {
  lessonId: number;
  notificationId: number;

  constructor(data?: LessonNotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
