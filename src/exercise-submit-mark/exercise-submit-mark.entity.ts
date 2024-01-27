import { BaseEntity } from '../base/base.entity';

export class ExerciseSubmitMarkEntity extends BaseEntity {
  exerciseSubmitId: number;

  point: number;

  totalCount: number;

  correctCount: number;

  constructor(data?: ExerciseSubmitMarkEntity) {
    super(data);
    Object.assign(this, data);
  }
}
