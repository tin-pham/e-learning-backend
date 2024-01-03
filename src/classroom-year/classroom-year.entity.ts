import { BaseEntity } from '../base/base.entity';

export class ClassroomYearEntity extends BaseEntity {
  classroomId: string;

  yearId: string;

  formTeacherId?: string;

  constructor(data?: Partial<ClassroomYearEntity>) {
    super();
    Object.assign(this, data);
  }
}
