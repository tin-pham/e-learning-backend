import { BaseEntity } from '../base/base.entity';

export class QuestionOptionEntity extends BaseEntity {
  text: string;

  questionId: number;
}
