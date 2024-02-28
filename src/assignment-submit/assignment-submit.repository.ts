import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { paginate } from '../common/function/paginate';
import { AssignmentSubmitEntity } from './assignment-submit.entity';
import { AssignmentSubmitGetListDTO } from './dto/assignment-submit.dto';

@Injectable()
export class AssignmentSubmitRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: AssignmentSubmitEntity) {
    return transaction
      .insertInto('assignmentSubmit')
      .values(entity)
      .returning(['id', 'attachmentId', 'assignmentId', 'createdBy'])
      .executeTakeFirst();
  }

  find(dto: AssignmentSubmitGetListDTO) {
    const { assignmentId, limit, page } = dto;
    const query = this.database
      .selectFrom('assignmentSubmit')
      .where('assignmentSubmit.assignmentId', '=', assignmentId)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .innerJoin('attachment', 'attachment.id', 'assignmentSubmit.attachmentId')
      .where('attachment.deletedAt', 'is', null)
      .select(['attachment.url']);

    return paginate(query, { limit, page });
  }

  findOneByAssignmentIdAndStudentId(assignmentId: number, studentId: string) {
    return this.database
      .selectFrom('assignmentSubmit')
      .where('assignmentSubmit.assignmentId', '=', assignmentId)
      .where('assignmentSubmit.studentId', '=', studentId)
      .innerJoin('attachment', 'attachment.id', 'assignmentSubmit.attachmentId')
      .select(['assignmentSubmit.id', 'attachment.url'])
      .executeTakeFirst();
  }
}
