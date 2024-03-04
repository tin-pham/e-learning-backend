import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { AssignmentEntity } from './assignment.entity';
import { AssignmentGetListDTO, AssignmentGetMyListDTO } from './dto/assignment.dto';

@Injectable()
export class AssignmentRepository {
  constructor(private readonly database: DatabaseService) {}

  findByStudentId(studentId: string, dto: AssignmentGetMyListDTO) {
    const { page, limit } = dto;
    const query = this.database
      .selectFrom('assignment')
      .where('assignment.deletedAt', 'is', null)
      .innerJoin('lesson', 'lesson.id', 'assignment.lessonId')
      .where('lesson.deletedAt', 'is', null)
      .innerJoin('section', 'section.id', 'lesson.sectionId')
      .where('section.deletedAt', 'is', null)
      .innerJoin('course', 'course.id', 'section.courseId')
      .where('course.deletedAt', 'is', null)
      .innerJoin('courseStudent', 'courseStudent.courseId', 'course.id')
      .where('courseStudent.deletedAt', 'is', null)
      .innerJoin('student', 'student.id', 'courseStudent.studentId')
      .where('student.id', '=', studentId)
      .innerJoin('users', 'users.id', 'student.userId')
      .where('users.deletedAt', 'is', null)
      .select(['assignment.id', 'assignment.name', 'assignment.dueDate', 'assignment.description']);

    return paginate(query, { page, limit });
  }

  getCourseIdById(id: number) {
    return this.database
      .selectFrom('assignment')
      .where('assignment.id', '=', id)
      .where('assignment.deletedAt', 'is', null)
      .innerJoin('lesson', 'lesson.id', 'assignment.lessonId')
      .where('lesson.deletedAt', 'is', null)
      .innerJoin('section', 'section.id', 'lesson.sectionId')
      .where('section.deletedAt', 'is', null)
      .innerJoin('course', 'course.id', 'section.courseId')
      .where('course.deletedAt', 'is', null)
      .select(['course.id as courseId'])
      .executeTakeFirst();
  }

  insertWithTransaction(transaction: Transaction, assignment: AssignmentEntity) {
    return transaction.insertInto('assignment').values(assignment).returning(['id', 'name', 'dueDate', 'description']).executeTakeFirst();
  }

  find(dto: AssignmentGetListDTO) {
    const { limit, page, lessonId } = dto;

    const withLesson = Boolean(lessonId);

    const query = this.database
      .selectFrom('assignment')
      .select(['assignment.id', 'assignment.name', 'assignment.dueDate', 'assignment.description'])
      .where('assignment.deletedAt', 'is', null)
      .orderBy('assignment.id', 'asc')
      .$if(withLesson, (qb) =>
        qb.innerJoin('lesson', 'lesson.id', 'assignment.lessonId').where('lessonId', '=', lessonId).where('lesson.deletedAt', 'is', null),
      );

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('assignment')
      .where('assignment.id', '=', id)
      .where('assignment.deletedAt', 'is', null)
      .innerJoin('users', 'users.id', 'assignment.createdBy')
      .where('users.deletedAt', 'is', null)
      .select([
        'assignment.id',
        'assignment.name',
        'assignment.dueDate',
        'assignment.description',
        'assignment.lessonId',
        'users.displayName as createdByDisplayName',
      ])
      .executeTakeFirst();
  }

  update(id: number, assignment: AssignmentEntity) {
    return this.database
      .updateTable('assignment')
      .set(assignment)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'dueDate', 'description'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('assignment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('assignment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('assignment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
