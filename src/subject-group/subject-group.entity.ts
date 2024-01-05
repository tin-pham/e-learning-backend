import { BaseEntity } from '../base/base.entity';

export class SubjectGroupEntity extends BaseEntity {
  subjectId: number;

  groupId: number;

  constructor(data: Partial<SubjectGroupEntity>) {
    super();
    Object.assign(this, data);
  }
}
