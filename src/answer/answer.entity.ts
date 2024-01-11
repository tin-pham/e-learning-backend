import { BaseEntity } from '../base/base.entity';

export class AnswerEntity extends BaseEntity {
  questionOptionId: number;

  questionId: number;
}
