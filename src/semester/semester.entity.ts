import { BaseService } from '../base';

export class SemesterEntity extends BaseService {
  name: string;

  startDate: Date;

  endDate: Date;
}
