import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { CourseOutcomeEntity } from './course-outcome.entity';

@Injectable()
export class CourseOutcomeRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: CourseOutcomeEntity) {
    return this.database.insertInto('courseOutcome').values(entity).returning(['id', 'name', 'courseId']).executeTakeFirst();
  }

  update(id: number, entity: CourseOutcomeEntity) {
    return this.database
      .updateTable('courseOutcome')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'courseId'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('courseOutcome')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'courseId'])
      .executeTakeFirst();
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('courseOutcome')
      .select(['id', 'name', 'courseId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('courseOutcome')
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameAndCourseId(name: string, courseId: number) {
    const { count } = await this.database
      .selectFrom('courseOutcome')
      .where('name', '=', name)
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameAndCourseIdExceptId(name: string, courseId: number, id: number) {
    const { count } = await this.database
      .selectFrom('courseOutcome')
      .where('name', '=', name)
      .where('courseId', '=', courseId)
      .where('deletedAt', 'is', null)
      .where('id', '!=', id)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirst();
    return Number(count);
  }
}
