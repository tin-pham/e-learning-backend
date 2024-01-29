import { BaseEntity } from '../base/base.entity';

export class AssignmentExerciseEntity extends BaseEntity {
  assignmentId: number;
  exerciseId: number;

  constructor(data?: AssignmentExerciseEntity) {
    super(data);
    Object.assign(this, data);
  }
}
