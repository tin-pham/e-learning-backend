export class AssignmentSubmitGradeStoreRO {
  id: number;
  assignmentSubmitId: number;
  message: string;
  grade: number;

  constructor(data?: AssignmentSubmitGradeStoreRO) {
    Object.assign(this, data);
  }
}
