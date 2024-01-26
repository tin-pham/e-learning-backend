import { BaseEntity } from '../base/base.entity';

export class QuestionCategoryEntity extends BaseEntity {
  name: string;

  constructor(data?: QuestionCategoryEntity) {
    super(data);
    if (data) {
      Object.assign(this, data);
    }
  }
}
