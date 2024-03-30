import { BaseEntity } from '../base/base.entity';

export class AssignmentNotificationEntity extends BaseEntity {
  assignmentId: number;
  notificationId: number;

  constructor(data?: AssignmentNotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
