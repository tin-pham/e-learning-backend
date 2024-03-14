import { BaseEntity } from '../base/base.entity';

export class StudentExerciseGradeEntity extends BaseEntity {
  studentExerciseId: number;
  point: number;
  totalCount: number;
  correctCount: number;

  constructor(data?: StudentExerciseGradeEntity) {
    super(data);
    Object.assign(this, data);
  }
}
