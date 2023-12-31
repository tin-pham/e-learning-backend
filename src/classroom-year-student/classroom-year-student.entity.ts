import { BaseEntity } from '../base/base.entity';

export class ClassroomYearStudentEntity extends BaseEntity {
  classroomYearId: string;

  studentId: string;

  constructor(data: Partial<ClassroomYearStudentEntity>) {
    super();
    Object.assign(this, data);
  }
}
