import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { AssignmentEntity } from './assignment.entity';
import { AssignmentGetListDTO } from './dto/assignment.dto';

@Injectable()
export class AssignmentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, assignment: AssignmentEntity) {
    return transaction.insertInto('assignment').values(assignment).returning(['id', 'name', 'dueDate', 'description']).executeTakeFirst();
  }

  find(dto: AssignmentGetListDTO) {
    const { limit, page, lessonId, courseId } = dto;

    const withLesson = Boolean(lessonId);
    const withCourse = Boolean(courseId);

    const query = this.database
      .selectFrom('assignment')
      .select(['assignment.id', 'assignment.name', 'assignment.dueDate', 'assignment.description', 'assignment.courseId'])
      .where('assignment.deletedAt', 'is', null)
      .orderBy('assignment.id', 'asc')
      .$if(withLesson, (qb) =>
        qb.innerJoin('lesson', 'lesson.id', 'assignment.lessonId').where('lessonId', '=', lessonId).where('lesson.deletedAt', 'is', null),
      )
      .$if(withCourse, (qb) =>
        qb.innerJoin('course', 'course.id', 'assignment.courseId').where('courseId', '=', courseId).where('course.deletedAt', 'is', null),
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
        'assignment.courseId',
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
      .returning(['id', 'name', 'dueDate', 'description', 'courseId'])
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
