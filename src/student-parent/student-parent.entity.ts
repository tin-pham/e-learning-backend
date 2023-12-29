import { BaseEntity } from '../base/base.entity';

export class StudentParentEntity extends BaseEntity {
  studentId: string;

  parentId: string;

  constructor(data: Partial<StudentParentEntity>) {
    super();
    Object.assign(this, data);
  }
}
