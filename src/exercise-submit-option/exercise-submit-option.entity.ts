import { BaseEntity } from '../base/base.entity';

export class ExerciseSubmitOptionEntity extends BaseEntity {
  questionId: number;
  questionOptionId: number;
  exerciseSubmitId: number;

  constructor(data?: ExerciseSubmitOptionEntity) {
    super(data);
    Object.assign(this, data);
  }
}
