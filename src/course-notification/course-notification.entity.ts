import { BaseEntity } from '../base/base.entity';

export class CourseNotificationEntity extends BaseEntity {
  notificationId: number;
  courseId: number;
}
