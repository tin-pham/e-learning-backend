import { BaseEntity } from '../base/base.entity';

export class YearEntity extends BaseEntity {
  name: string;

  startDate: Date;

  endDate: Date;
}
