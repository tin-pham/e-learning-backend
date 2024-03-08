import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { LessonEntity } from './lesson.entity';
import { LessonGetListDTO } from './dto/lesson.dto';

@Injectable()
export class LessonRepository {
  constructor(private readonly database: DatabaseService) {}

  getCourseIdById(id: number) {
    return this.database
      .selectFrom('lesson')
      .where('lesson.id', '=', id)
      .where('lesson.deletedAt', 'is', null)
      .innerJoin('section', 'section.id', 'lesson.sectionId')
      .where('section.deletedAt', 'is', null)
      .innerJoin('course', 'course.id', 'section.courseId')
      .where('course.deletedAt', 'is', null)
      .select(['course.id as courseId'])
      .executeTakeFirst();
  }

  deleteMultipleBySectionIdWithTransaction(transaction: Transaction, sectionId: number, actorId: number) {
    return transaction
      .updateTable('lesson')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('sectionId', '=', sectionId)
      .execute();
  }

  insert(entity: LessonEntity) {
    return this.database.insertInto('lesson').values(entity).returning(['id', 'body', 'title', 'sectionId', 'videoUrl']).executeTakeFirst();
  }

  find(dto: LessonGetListDTO) {
    const { limit, page, sectionId } = dto;

    const withSection = Boolean(sectionId);

    const query = this.database
      .selectFrom('lesson')
      .select(['lesson.id', 'lesson.title', 'lesson.body'])
      .where('lesson.deletedAt', 'is', null)
      .orderBy('lesson.id', 'asc')
      .$if(withSection, (qb) =>
        qb
          .innerJoin('section', 'section.id', 'lesson.sectionId')
          .where('section.id', '=', sectionId)
          .where('section.deletedAt', 'is', null),
      );

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('lesson')
      .where('lesson.id', '=', id)
      .where('lesson.deletedAt', 'is', null)
      .innerJoin('section', 'section.id', 'lesson.sectionId')
      .where('section.deletedAt', 'is', null)
      .innerJoin('course', 'course.id', 'section.courseId')
      .where('course.deletedAt', 'is', null)
      .select([
        'lesson.id',
        'lesson.title',
        'lesson.body',
        'lesson.sectionId',
        'lesson.videoUrl',
        'lesson.createdBy',
        'course.id as courseId',
      ])
      .executeTakeFirst();
  }

  update(id: number, entity: LessonEntity) {
    return this.database
      .updateTable('lesson')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'title', 'body', 'videoUrl'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('lesson')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('lesson')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('lesson')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
