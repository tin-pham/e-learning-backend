import { BaseEntity } from '../base/base.entity';

export class SubjectGroupEntity extends BaseEntity {
  subjectId: string;

  groupId: string;

  constructor(data: Partial<SubjectGroupEntity>) {
    super();
    Object.assign(this, data);
  }
}
