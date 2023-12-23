export class SubjectGroupEntity {
  subjectId: string;

  groupId: string;

  constructor(data: Partial<SubjectGroupEntity>) {
    Object.assign(this, data);
  }
}
