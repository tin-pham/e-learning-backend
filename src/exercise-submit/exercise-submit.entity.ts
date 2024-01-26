import { BaseEntity } from '../base/base.entity';

export class ExerciseSubmitEntity extends BaseEntity {
  isSubmit: boolean;

  exerciseId: number;

  studentId: string;

  constructor(data?: ExerciseSubmitEntity) {
    super(data);
    Object.assign(this, data);
  }
}
