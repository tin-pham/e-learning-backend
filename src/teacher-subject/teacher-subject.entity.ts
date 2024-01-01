import { BaseEntity } from '../base/base.entity';

export class TeacherSubjectEntity extends BaseEntity {
  teacherId: string;
  subjectId: string;

  constructor(data?: Partial<TeacherSubjectEntity>) {
    super(data);
    Object.assign(this, data);
  }
}
