import { BaseEntity } from '../base/base.entity';

export class AssignmentEntity extends BaseEntity {
  name: string;

  description: string;

  dueDate: Date;

  lessonId: number;

  constructor(data?: AssignmentEntity) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}
