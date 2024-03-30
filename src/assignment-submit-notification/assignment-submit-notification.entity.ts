import { BaseEntity } from '../base/base.entity';

export class AssignmentSubmitNotificationEntity extends BaseEntity {
  assignmentSubmitId: number;
  notificationId: number;

  constructor(data?: AssignmentSubmitNotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
