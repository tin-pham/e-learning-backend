import { BaseEntity } from '../base/base.entity';

export class PostNotificationEntity extends BaseEntity {
  notificationId: number;
  postId: number;

  constructor(data?: PostNotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
