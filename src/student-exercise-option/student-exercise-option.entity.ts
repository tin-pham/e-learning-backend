import { BaseEntity } from '../base/base.entity';

export class StudentExerciseOptionEntity extends BaseEntity {
  questionSnapshotId: number;
  questionOptionSnapshotId: number;
  studentExerciseId: number;

  constructor(data?: StudentExerciseOptionEntity) {
    super(data);
    Object.assign(this, data);
  }
}
