import { BaseEntity } from '../base/base.entity';

export class CourseStudentEntity extends BaseEntity {
  courseId: number;
  studentId: string;

  constructor(data?: CourseStudentEntity) {
    super(data);
  }
}
