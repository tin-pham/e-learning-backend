import { BaseEntity } from '../base/base.entity';

export class ExerciseQuestionOptionSnapshotEntity extends BaseEntity {
  text: string;
  isCorrect: boolean;
  questionId: number;

  exerciseId: number;
  questionOptionId: number;
  capturedAt: Date;
}
