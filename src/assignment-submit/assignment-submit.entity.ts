import { BaseEntity } from '../base/base.entity';

export class AssignmentSubmitEntity extends BaseEntity {
  attachmentId: number;

  assignmentId: number;

  studentId: string;

  status: number;

  constructor(data?: AssignmentSubmitEntity) {
    super(data);
    Object.assign(this, data);
  }
}
