import { BaseEntity } from '../base/base.entity';

export class ClassroomYearEntity extends BaseEntity {
  classroomId: number;

  yearId: number;

  formTeacherId?: string;

  constructor(data?: Partial<ClassroomYearEntity>) {
    super();
    Object.assign(this, data);
  }
}
