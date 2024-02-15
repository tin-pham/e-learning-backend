import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { CategoryEntity } from './category.entity';
import { CategoryGetListDTO } from './dto/category.dto';
import { paginate } from 'src/common/function/paginate';
import { sql } from 'kysely';

@Injectable()
export class CategoryRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(category: CategoryEntity) {
    return this.database.insertInto('category').values(category).returning(['id', 'name', 'description']).executeTakeFirst();
  }

  find(dto: CategoryGetListDTO) {
    const { page, limit, withCourse, withCourseCount, search } = dto;

    let query;

    if (withCourse) {
      query = this.database
        .with('limitedCourses', (eb) =>
          eb
            .selectFrom('course')
            .innerJoin('categoryCourse', 'categoryCourse.courseId', 'course.id')
            .where('course.deletedAt', 'is', null)
            .where('categoryCourse.deletedAt', 'is', null)
            .limit(10)
            .select(['course.id', 'course.name', 'course.description', 'course.imageUrl', 'categoryCourse.categoryId'])
            .distinct()
            .orderBy('course.id'),
        )
        .selectFrom('category')
        .where('category.deletedAt', 'is', null)
        .leftJoin('limitedCourses', 'limitedCourses.categoryId', 'category.id')
        .select(({ fn, ref }) => [
          'category.id',
          'category.name',
          'category.description',
          fn
            .coalesce(
              sql`json_agg(
              json_build_object(
                'id', ${ref('limitedCourses.id')}, 
                'name', ${ref('limitedCourses.name')}, 
                'description', ${ref('limitedCourses.description')}, 
                'imageUrl', ${ref('limitedCourses.imageUrl')}
              ) ORDER BY ${ref('limitedCourses.id')}
            ) FILTER (WHERE ${ref('limitedCourses.id')} IS NOT NULL)`,
              sql`'[]'`,
            )
            .as('courses'),
        ])
        .groupBy(['category.id', 'category.name', 'category.description']);
    } else if (withCourseCount) {
      query = this.database
        .selectFrom('category')
        .leftJoin('categoryCourse', (join) =>
          join.onRef('categoryCourse.categoryId', '=', 'category.id').on('categoryCourse.deletedAt', 'is', null),
        )
        .leftJoin('course', (join) => join.onRef('course.id', '=', 'categoryCourse.courseId').on('course.deletedAt', 'is', null))
        .where('category.deletedAt', 'is', null)
        .select(({ fn }) => ['category.id', 'category.name', 'category.description', fn.count('course.id').as('courseCount')])
        .where('category.deletedAt', 'is', null)
        .groupBy(['category.id', 'category.name', 'category.description']);
    } else {
      query = this.database.selectFrom('category').select(['id', 'name', 'description']).where('deletedAt', 'is', null);
    }

    if (search) {
      query = query.where('category.name', 'ilike', `%${search}%`);
    }

    return paginate(query, { page, limit });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('category')
      .where('category.id', '=', id)
      .where('category.deletedAt', 'is', null)
      .select(['id', 'name', 'description'])
      .executeTakeFirst();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('category')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'description'])
      .executeTakeFirst();
  }

  update(id: number, entity: CategoryEntity) {
    return this.database
      .updateTable('category')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'description'])
      .executeTakeFirst();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('category')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: number) {
    const { count } = await this.database
      .selectFrom('category')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .where('id', '!=', id)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('category')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('category')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
