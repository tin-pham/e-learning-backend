import { BaseEntity } from '../base/base.entity';

export class NotificationEntity extends BaseEntity {
  title: string;
  content: string;

  constructor(data?: NotificationEntity) {
    super(data);
    Object.assign(this, data);
  }
}
