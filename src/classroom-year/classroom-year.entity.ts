export class ClassroomYearEntity {
  classroomId: string;

  yearId: string;

  constructor(data: Partial<ClassroomYearEntity>) {
    Object.assign(this, data);
  }
}
