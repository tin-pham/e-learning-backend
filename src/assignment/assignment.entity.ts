import { BaseEntity } from '../base/base.entity';

export class AssignmentEntity extends BaseEntity {
  name: string;

  description: string;

  dueDate: Date;

  courseId: number;

  lessonId: number;

  constructor(data?: AssignmentEntity) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}
