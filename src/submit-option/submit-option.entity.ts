import { BaseEntity } from '../base/base.entity';

export class SubmitOptionEntity extends BaseEntity {
  exerciseId: number;

  questionId: number;

  questionOptionId: number;

  constructor(data?: SubmitOptionEntity) {
    super(data);
    Object.assign(this, data);
  }
}
