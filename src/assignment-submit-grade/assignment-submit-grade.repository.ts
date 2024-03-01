import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database';
import { AssignmentSubmitGradeEntity } from './assignment-submit-grade.entity';

@Injectable()
export class AssignmentSubmitGradeRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: AssignmentSubmitGradeEntity) {
    return this.database
      .insertInto('assignmentSubmitGrade')
      .values(entity)
      .returning(['id', 'grade', 'message', 'assignmentSubmitId'])
      .executeTakeFirst();
  }
}
