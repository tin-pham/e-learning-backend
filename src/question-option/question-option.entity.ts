import { BaseEntity } from '../base/base.entity';

export class QuestionOptionEntity extends BaseEntity {
  text: string;

  isCorrect: boolean;

  questionId: number;

  constructor(data?: QuestionOptionEntity) {
    super(data);
    Object.assign(this, data);
  }
}
