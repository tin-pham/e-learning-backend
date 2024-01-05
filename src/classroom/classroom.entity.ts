import { ClassroomYearEntity } from '../classroom-year/classroom-year.entity';
import { BaseEntity } from '../base/base.entity';

export class ClassroomFlatEntity extends BaseEntity {
  name: string;
  gradeId: number;
  classroomYearId?: number;
}

export class ClassroomEntity extends BaseEntity {
  name: string;

  gradeId: number;

  classroomYear?: ClassroomYearEntity;

  constructor(data?: Partial<ClassroomFlatEntity>) {
    super(data);
    this.name = data?.name;
    this.gradeId = data?.gradeId;

    if (data?.classroomYearId) {
      this.classroomYear = new ClassroomYearEntity();
      this.classroomYear.id = data?.classroomYearId;
    }
  }
}
