import { BaseEntity } from '../base/base.entity';

export class YearGradeEntity extends BaseEntity {
  yearId: number;

  gradeId: number;

  constructor(data: Partial<YearGradeEntity>) {
    super();
    Object.assign(this, data);
  }
}
