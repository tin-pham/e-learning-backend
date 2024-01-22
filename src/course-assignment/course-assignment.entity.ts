import { BaseEntity } from '../base/base.entity';

export class CourseAssignmentEntity extends BaseEntity {
  courseId: number;

  assignmentId: number;

  constructor(data?: CourseAssignmentEntity) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}
