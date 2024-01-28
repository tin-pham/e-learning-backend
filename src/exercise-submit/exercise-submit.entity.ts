import { BaseEntity } from '../base/base.entity';

export class ExerciseSubmitEntity extends BaseEntity {
  exerciseId: number;

  studentId: string;

  constructor(data?: ExerciseSubmitEntity) {
    super(data);
    Object.assign(this, data);
  }
}
