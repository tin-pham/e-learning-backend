import { BaseEntity } from '../base/base.entity';

export class NotificationEntity extends BaseEntity {
  title: string;
  content: string;
  courseId: number;

  constructor(data?: NotificationEntity) {
    super();
    Object.assign(this, data);
  }
}
