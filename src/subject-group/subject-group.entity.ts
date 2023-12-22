export class SubjectGroupEntity {
  id: string;

  subjectId: string;

  groupId: string;

  constructor(data: Partial<SubjectGroupEntity>) {
    Object.assign(this, data);
  }
}
