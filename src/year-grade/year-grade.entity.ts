import { BaseEntity } from '../base/base.entity';

export class YearGradeEntity extends BaseEntity {
  yearId: string;

  gradeId: string;

  constructor(data: Partial<YearGradeEntity>) {
    super();
    Object.assign(this, data);
  }
}
