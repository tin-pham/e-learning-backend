import { BaseEntity } from '../base/base.entity';

export class ExerciseEntity extends BaseEntity {
  name: string;
  difficultyId: number;
  isActive?: boolean;
  activatedAt?: Date;
  time?: number;
  dueDate?: Date;
  instantMark: boolean;
  allowRedo: boolean;

  constructor(data?: ExerciseEntity) {
    super(data);
    Object.assign(this, data);
  }
}
