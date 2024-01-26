import { BaseEntity } from '../base/base.entity';

export class SubmitEntity extends BaseEntity {
  exerciseId: number;

  constructor(data?: SubmitEntity) {
    super(data);
    Object.assign(this, data);
  }
}
