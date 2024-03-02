import { Injectable } from '@nestjs/common';
import { DatabaseService } from 'src/database';
import { AssignmentSubmitGradeEntity } from './assignment-submit-grade.entity';

@Injectable()
export class AssignmentSubmitGradeRepository {
  constructor(private readonly database: DatabaseService) {}

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('assignmentSubmitGrade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('assignmentSubmitGrade')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countByAssignmentSubmitId(assignmentSubmitId: number) {
    const { count } = await this.database
      .selectFrom('assignmentSubmitGrade')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignmentSubmitId', '=', assignmentSubmitId)
      .where('assignmentSubmitGrade.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  insert(entity: AssignmentSubmitGradeEntity) {
    return this.database
      .insertInto('assignmentSubmitGrade')
      .values(entity)
      .returning(['id', 'grade', 'message', 'assignmentSubmitId'])
      .executeTakeFirst();
  }

  findOneByAssignmentSubmitId(assignmentSubmitId: number) {
    return this.database
      .selectFrom('assignmentSubmitGrade')
      .select(['id', 'grade', 'message', 'assignmentSubmitId'])
      .where('assignmentSubmitId', '=', assignmentSubmitId)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }
}
