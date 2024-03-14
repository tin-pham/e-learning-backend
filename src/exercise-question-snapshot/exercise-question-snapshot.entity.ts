import { BaseEntity } from '../base/base.entity';

export class ExerciseQuestionSnapshotEntity extends BaseEntity {
  text: string;
  difficultyId: number;
  isMultipleChoice: boolean;

  exerciseId: number;
  questionId: number;
  capturedAt: Date;
}
