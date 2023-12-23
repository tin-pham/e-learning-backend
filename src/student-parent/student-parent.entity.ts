export class StudentParentEntity {
  studentId: string;

  parentId: string;

  constructor(data: Partial<StudentParentEntity>) {
    Object.assign(this, data);
  }
}
