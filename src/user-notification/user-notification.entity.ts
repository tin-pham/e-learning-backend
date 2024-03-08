import { BaseEntity } from '../base/base.entity';

export class UserNotificationEntity extends BaseEntity {
  userId: number;
  notificationId: number;
  isRead?: boolean;

  constructor(data?: UserNotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
