import { BaseEntity } from '../base/base.entity';

export class LessonExerciseEntity extends BaseEntity {
  lessonId: number;
  exerciseId: number;

  constructor(data?: LessonExerciseEntity) {
    super(data);
    Object.assign(this, data);
  }
}
