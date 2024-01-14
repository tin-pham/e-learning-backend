import { BaseEntity } from '../base/base.entity';

export class ExerciseQuestionEntity extends BaseEntity {
  exerciseId: number;
  questionId: number;

  constructor(data?: Partial<ExerciseQuestionEntity>) {
    super(data);
  }
}
