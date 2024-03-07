import { BaseEntity } from '../base/base.entity';

export class CommentNotificationEntity extends BaseEntity {
  commentId: number;
  notificationId: number;

  constructor(data?: CommentNotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
