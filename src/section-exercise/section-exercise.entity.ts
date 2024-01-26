import { BaseEntity } from '../base/base.entity';

export class SectionExerciseEntity extends BaseEntity {
  sectionId: number;
  exerciseId: number;

  constructor(data?: SectionExerciseEntity) {
    super(data);
    Object.assign(this, data);
  }
}
