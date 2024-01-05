import { BaseEntity } from '../base/base.entity';

export class ClassroomYearAssignmentEntity extends BaseEntity {
  classroomYearId: number;

  teacherSubjectId: number;

  constructor(data: Partial<ClassroomYearAssignmentEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
