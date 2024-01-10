import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { SectionEntity } from './section.entity';
import { SectionGetListDTO } from './dto/section.dto';

export class SectionRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: SectionEntity) {
    return this.database.insertInto('section').values(entity).returning(['id', 'name', 'courseId']).executeTakeFirst();
  }

  find(dto: SectionGetListDTO) {
    const { limit, page, courseId } = dto;

    const withCourse = Boolean(courseId);

    const query = this.database
      .selectFrom('section')
      .select(['id', 'name'])
      .where('deletedAt', 'is', null)
      .orderBy('createdAt', 'desc')
      .$if(withCourse, (qb) =>
        qb
          .innerJoin('course', 'section.id', 'section.courseId')
          .where('section.courseId', '=', courseId)
          .where('course.deletedAt', 'is', null),
      );

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('section')
      .select(['id', 'name', 'courseId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
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

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('section')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
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
