import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { SectionEntity } from './section.entity';
import { SectionGetDetailDTO, SectionGetListDTO } from './dto/section.dto';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { sql } from 'kysely';

@Injectable()
export class SectionRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: SectionEntity) {
    return this.database.insertInto('section').values(entity).returning(['id', 'name', 'courseId']).executeTakeFirst();
  }

  find(dto: SectionGetListDTO) {
    const { limit, page, courseId, withLesson } = dto;

    const withCourse = Boolean(courseId);

    const query = this.database
      .selectFrom('section')
      .select(['section.id', 'section.name'])
      .where('section.deletedAt', 'is', null)
      .orderBy('section.name', 'asc')
      .groupBy(['section.id', 'section.name'])
      .$if(withCourse, (qb) =>
        qb
          .innerJoin('course', 'course.id', 'section.courseId')
          .where('section.courseId', '=', courseId)
          .where('course.deletedAt', 'is', null),
      )
      .$if(withLesson, (qb) =>
        qb
          .leftJoin('lesson', (join) => join.onRef('lesson.sectionId', '=', 'section.id').on('lesson.deletedAt', 'is', null))
          .select(({ fn, ref }) => [
            fn
              .coalesce(
                sql`json_agg(json_build_object('id', ${ref('lesson.id')}, 'title', ${ref('lesson.title')}) ORDER BY ${ref(
                  'lesson.id',
                )} ) FILTER (WHERE ${ref('lesson.id')} is not null) `,
                sql`'[]'`,
              )
              .as('lessons'),
          ]),
      );

    return paginate(query, { limit, page });
  }

  findOneById(id: number, dto: SectionGetDetailDTO) {
    const { withLesson } = dto;
    return this.database
      .selectFrom('section')
      .select(['section.id', 'section.name', 'section.courseId'])
      .where('section.id', '=', id)
      .where('section.deletedAt', 'is', null)
      .groupBy(['section.id', 'section.name', 'section.courseId'])
      .$if(withLesson, (qb) =>
        qb
          .leftJoin('lesson', (join) => join.onRef('lesson.sectionId', '=', 'section.id').on('lesson.deletedAt', 'is', null))
          .select(({ fn, ref }) => [
            fn
              .coalesce(
                fn
                  .jsonAgg(
                    jsonBuildObject({
                      id: ref('lesson.id'),
                      title: ref('lesson.title'),
                    }),
                  )
                  .filterWhere('lesson.id', 'is not', null),
                sql`'[]'`,
              )
              .as('lessons'),
          ]),
      )
      .executeTakeFirst();
  }

  update(id: number, entity: SectionEntity) {
    return this.database
      .updateTable('section')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'courseId'])
      .executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('section')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .returning(['id'])
      .executeTakeFirst();
  }

  deleteMultipleByCourseIdWithTransaction(transaction: Transaction, courseId: number, actorId: number) {
    return transaction
      .updateTable('section')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('courseId', '=', courseId)
      .executeTakeFirst();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('section')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('section.name', '=', name)
      .where('section.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: number) {
    const { count } = await this.database
      .selectFrom('section')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('section.name', '=', name)
      .where('section.deletedAt', 'is', null)
      .where('section.id', '!=', id)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('section')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('section.id', '=', id)
      .where('section.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
