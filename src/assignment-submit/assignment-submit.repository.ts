import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { paginate } from '../common/function/paginate';
import { AssignmentSubmitEntity } from './assignment-submit.entity';
import { AssignmentSubmitGetListDTO } from './dto/assignment-submit.dto';

@Injectable()
export class AssignmentSubmitRepository {
  constructor(private readonly database: DatabaseService) {}

  findOneById(id: number) {
    return this.database
      .selectFrom('assignmentSubmit')
      .where('assignmentSubmit.id', '=', id)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .innerJoin('attachment', 'attachment.id', 'assignmentSubmit.attachmentId')
      .where('attachment.deletedAt', 'is', null)
      .select(['attachment.url as attachmentUrl'])
      .executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('assignmentSubmit')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('assignmentSubmit.id', '=', id)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('assignmentSubmit')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignmentSubmit.id', '=', id)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

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
      .where('assignmentSubmit.deletedAt', 'is', null)
      .innerJoin('attachment', 'attachment.id', 'assignmentSubmit.attachmentId')
      .select([
        'assignmentSubmit.id',
        'attachment.url as attachmentUrl',
        'attachment.name as attachmentName',
        'attachment.createdAt as attachmentCreatedAt',
        'attachment.createdBy as attachmentCreatedBy',
      ])
      .executeTakeFirst();
  }
}
