import { BaseEntity } from '../base/base.entity';

export class LessonExerciseEntity extends BaseEntity {
  lessonId: string;
  exerciseId: string;

  constructor(data?: LessonExerciseEntity) {
    super(data);
    Object.assign(this, data);
  }
}
