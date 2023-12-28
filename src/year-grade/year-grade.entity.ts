export class YearGradeEntity {
  yearId: string;

  gradeId: string;

  constructor(data: Partial<YearGradeEntity>) {
    Object.assign(this, data);
  }
}
