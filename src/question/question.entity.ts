import { BaseEntity } from '../base/base.entity';

export class QuestionEntity extends BaseEntity {
  text: string;

  difficultyId: number;

  isMultipleChoice: boolean;
}
