import { BaseEntity } from '../base/base.entity';

export class ClassroomYearAssignmentEntity extends BaseEntity {
  classroomYearId: string;

  teacherSubjectId: string;

  constructor(data: Partial<ClassroomYearAssignmentEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
