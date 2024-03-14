import { BaseEntity } from '../base/base.entity';

export class StudentExerciseEntity extends BaseEntity {
  exerciseId: number;
  studentId: string;
  isSubmitted: boolean;
  submittedAt: Date;
  isLate: boolean;
}
