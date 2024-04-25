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
      .innerJoin('courseAssignment', 'courseAssignment.assignmentId', 'assignment.id')
      .where('courseAssignment.deletedAt', 'is', null)
      .innerJoin('course', 'course.id', 'courseAssignment.courseId')
      .where('course.deletedAt', 'is', null)
      .select(['course.id as courseId'])
      .executeTakeFirst();
  }

  insertWithTransaction(transaction: Transaction, assignment: AssignmentEntity) {
    return transaction.insertInto('assignment').values(assignment).returning(['id', 'name', 'dueDate']).executeTakeFirst();
  }

  find(dto: AssignmentGetListDTO, actorId: number) {
    const { limit, page, lessonId, courseId, withSubmission } = dto;

    const byLesson = Boolean(lessonId);
    const byCourse = Boolean(courseId);

    const query = this.database
      .selectFrom('assignment')
      .select(['assignment.id', 'assignment.name', 'assignment.dueDate', 'assignment.description'])
      .where('assignment.deletedAt', 'is', null)
      .orderBy('assignment.id', 'asc')
      .$if(byLesson, (qb) =>
        qb.innerJoin('lesson', 'lesson.id', 'assignment.lessonId').where('lessonId', '=', lessonId).where('lesson.deletedAt', 'is', null),
      )
      .$if(byCourse, (qb) =>
        qb
          .innerJoin('courseAssignment', 'courseAssignment.assignmentId', 'assignment.id')
          .where('courseAssignment.deletedAt', 'is', null)
          .innerJoin('course', 'course.id', 'courseAssignment.courseId')
          .where('course.id', '=', courseId)
          .where('course.deletedAt', 'is', null),
      )
      .$if(withSubmission, (qb) =>
        qb
          .leftJoin('assignmentSubmit', (join) =>
            join
              .onRef('assignmentSubmit.assignmentId', '=', 'assignment.id')
              .on('assignmentSubmit.deletedAt', 'is', null)
              .on('assignmentSubmit.createdBy', '=', actorId),
          )
          .leftJoin('assignmentSubmitGrade', (join) =>
            join
              .onRef('assignmentSubmitGrade.assignmentSubmitId', '=', 'assignmentSubmit.id')
              .on('assignmentSubmitGrade.deletedAt', 'is', null),
          )
          .select([
            'assignmentSubmit.id as submissionId',
            'assignmentSubmit.createdAt as submissionDate',
            'assignmentSubmitGrade.grade as submissionGrade',
          ]),
      );

    return paginate(query, { limit, page });
  }

  findOneById(id: number, actorId?: number) {
    return this.database
      .selectFrom('assignment')
      .where('assignment.id', '=', id)
      .where('assignment.deletedAt', 'is', null)
      .innerJoin('users', 'users.id', 'assignment.createdBy')
      .where('users.deletedAt', 'is', null)
      .leftJoin('assignmentSubmit', (join) =>
        join
          .onRef('assignmentSubmit.assignmentId', '=', 'assignment.id')
          .on('assignmentSubmit.deletedAt', 'is', null)
          .on('assignmentSubmit.createdBy', '=', actorId),
      )
      .leftJoin('assignmentSubmitGrade', (join) =>
        join
          .onRef('assignmentSubmitGrade.assignmentSubmitId', '=', 'assignmentSubmit.id')
          .on('assignmentSubmitGrade.deletedAt', 'is', null),
      )
      .leftJoin('lesson', (join) => join.onRef('lesson.id', '=', 'assignment.lessonId').on('lesson.deletedAt', 'is', null))
      .leftJoin('section', (join) => join.onRef('section.id', '=', 'lesson.sectionId').on('section.deletedAt', 'is', null))
      .leftJoin('course', (join) => join.onRef('course.id', '=', 'section.courseId').on('course.deletedAt', 'is', null))
      .select([
        'assignment.id',
        'assignment.name',
        'assignment.dueDate',
        'assignment.description',
        'assignment.lessonId',
        'users.displayName as createdByDisplayName',
        'users.createdBy',
        'assignmentSubmit.id as submissionId',
        'assignmentSubmit.createdAt as submissionDate',
        'assignmentSubmitGrade.grade as submissionGrade',
        'lesson.id as lessonId',
        'lesson.title as lessonTitle',
        'section.id as sectionId',
        'course.id as courseId',
      ])
      .executeTakeFirst();
  }

  update(id: number, assignment: AssignmentEntity) {
    return this.database
      .updateTable('assignment')
      .set(assignment)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'dueDate'])
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

  async countByNameAndLessonId(name: string, lessonId: number) {
    const { count } = await this.database
      .selectFrom('assignment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignment.name', '=', name)
      .where('assignment.lessonId', '=', lessonId)
      .where('assignment.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameAndLessonIdExceptId(name: string, lessonId: number, id: number) {
    const { count } = await this.database
      .selectFrom('assignment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignment.name', '=', name)
      .where('assignment.lessonId', '=', lessonId)
      .where('assignment.id', '!=', id)
      .where('assignment.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
