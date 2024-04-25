import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { paginate } from '../common/function/paginate';
import { AssignmentSubmitEntity } from './assignment-submit.entity';
import { AssignmentSubmitGetListDTO } from './dto/assignment-submit.dto';

@Injectable()
export class AssignmentSubmitRepository {
  constructor(private readonly database: DatabaseService) {}

  findBeforeEqualDueDateByAssignmentId(assignmentId: number) {
    return this.database
      .selectFrom('assignmentSubmit')
      .where('assignmentSubmit.deletedAt', 'is', null)
      .where('assignmentSubmit.assignmentId', '=', assignmentId)
      .innerJoin('assignment', 'assignment.id', 'assignmentSubmit.assignmentId')
      .where('assignment.deletedAt', 'is', null)
      .whereRef('assignment.dueDate', '>=', 'assignmentSubmit.createdAt')
      .execute();
  }

  findAfterDueDateByAssignmentId(assignmentId: number) {
    return this.database
      .selectFrom('assignmentSubmit')
      .where('assignmentSubmit.deletedAt', 'is', null)
      .where('assignmentSubmit.assignmentId', '=', assignmentId)
      .innerJoin('assignment', 'assignment.id', 'assignmentSubmit.assignmentId')
      .where('assignment.deletedAt', 'is', null)
      .whereRef('assignment.dueDate', '<', 'assignmentSubmit.createdAt')
      .execute();
  }

  async countByAssignmentId(assignmentId: number) {
    const { count } = await this.database
      .selectFrom('assignmentSubmit')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignmentSubmit.assignmentId', '=', assignmentId)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByAssignmentIdBeforeDueDate(assignmentId: number) {
    const { count } = await this.database
      .selectFrom('assignmentSubmit')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignmentSubmit.assignmentId', '=', assignmentId)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .innerJoin('assignment', 'assignment.id', 'assignmentSubmit.assignmentId')
      .where('assignment.deletedAt', 'is', null)
      .whereRef('assignment.dueDate', '>=', 'assignmentSubmit.createdAt')
      .executeTakeFirst();
    return Number(count);
  }

  async countByAssignmentIdAfterDueDate(assignmentId: number) {
    const { count } = await this.database
      .selectFrom('assignmentSubmit')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignmentSubmit.assignmentId', '=', assignmentId)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .innerJoin('assignment', 'assignment.id', 'assignmentSubmit.assignmentId')
      .where('assignment.deletedAt', 'is', null)
      .whereRef('assignment.dueDate', '<', 'assignmentSubmit.createdAt')
      .executeTakeFirst();
    return Number(count);
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('assignmentSubmit')
      .where('assignmentSubmit.id', '=', id)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .innerJoin('assignment', 'assignment.id', 'assignmentSubmit.assignmentId')
      .where('assignment.deletedAt', 'is', null)
      .innerJoin('attachment', 'attachment.id', 'assignmentSubmit.attachmentId')
      .where('attachment.deletedAt', 'is', null)
      .innerJoin('student', 'student.id', 'assignmentSubmit.studentId')
      .innerJoin('users', 'users.id', 'student.userId')
      .where('users.deletedAt', 'is', null)
      .leftJoin('userImage', (join) => join.onRef('users.id', '=', 'userImage.userId').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('userImage.imageId', '=', 'image.id').on('image.deletedAt', 'is', null))
      .select([
        'assignmentSubmit.id',
        'assignmentSubmit.createdBy',
        'assignmentSubmit.createdAt',
        'assignment.createdBy as assignmentCreatedBy',
        'attachment.url as attachmentUrl',
        'attachment.name as attachmentName',
        'users.displayName as studentName',
        'image.url as userImageUrl',
      ])
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

  getAssignmentById(id: number) {
    return this.database
      .selectFrom('assignmentSubmit')
      .where('assignmentSubmit.id', '=', id)
      .where('assignmentSubmit.deletedAt', 'is', null)
      .innerJoin('assignment', 'assignment.id', 'assignmentSubmit.assignmentId')
      .where('assignment.deletedAt', 'is', null)
      .select([
        'assignment.name as assignmentName',
        'assignmentSubmit.id',
        'assignmentSubmit.createdBy',
        'assignment.id as assignmentId',
        'assignment.lessonId as assignmentLessonId',
      ])
      .executeTakeFirst();
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
      .innerJoin('student', 'student.id', 'assignmentSubmit.studentId')
      .innerJoin('users', 'users.id', 'student.userId')
      .where('users.deletedAt', 'is', null)
      .leftJoin('userImage', (join) => join.onRef('users.id', '=', 'userImage.userId').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('userImage.imageId', '=', 'image.id').on('image.deletedAt', 'is', null))
      .leftJoin('assignmentSubmitGrade', (join) =>
        join
          .onRef('assignmentSubmit.id', '=', 'assignmentSubmitGrade.assignmentSubmitId')
          .on('assignmentSubmitGrade.deletedAt', 'is', null),
      )
      .select([
        'assignmentSubmit.id',
        'attachment.url as attachmentUrl',
        'attachment.name as attachmentName',
        'attachment.createdAt as attachmentCreatedAt',
        'attachment.createdBy as attachmentCreatedBy',
        'users.displayName as studentName',
        'image.url as userImageUrl',
        'assignmentSubmitGrade.grade as grade',
      ]);

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
