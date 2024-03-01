import { BaseEntity } from '../base/base.entity';

export class AssignmentSubmitGradeEntity extends BaseEntity {
  assignmentSubmitId: number;
  grade: number;
  message: string;

  constructor(data?: AssignmentSubmitGradeEntity) {
    super(data);
    Object.assign(this, data);
  }
}
