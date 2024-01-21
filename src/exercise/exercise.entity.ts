import { BaseEntity } from '../base/base.entity';

export class ExerciseEntity extends BaseEntity {
  name: string;

  difficultyId: number;

  constructor(data?: ExerciseEntity) {
    super(data);
    Object.assign(this, data);
  }
}
