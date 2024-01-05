import { BaseEntity } from '../base/base.entity';

export class SemesterEntity extends BaseEntity {
  name: string;

  startDate: Date;

  endDate: Date;

  yearId: number;
}
