import { BaseEntity } from 'src/base/base.entity';

export class QuestionCategoryHasQuestionEntity extends BaseEntity {
  questionCategoryId: number;
  questionId: number;

  constructor(data?: QuestionCategoryHasQuestionEntity) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}
