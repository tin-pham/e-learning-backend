import { BaseEntity } from '../base/base.entity';

export class QuestionOptionEntity extends BaseEntity {
  text: string;

  isCorrect: boolean;

  questionId: number;
}
