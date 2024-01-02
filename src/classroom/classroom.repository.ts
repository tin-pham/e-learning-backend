import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { paginate } from '../common/function/paginate';
import { ClassroomEntity } from './classroom.entity';
import { ClassroomGetListDTO } from './dto/classroom.dto';
import { jsonArrayFrom } from 'kysely/helpers/postgres';

@Injectable()
export class ClassroomRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: ClassroomEntity) {
    return this.database
      .insertInto('classroom')
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  insertMultipleWithTransaction(
    transaction: Transaction,
    entities: ClassroomEntity[],
  ) {
    return transaction
      .insertInto('classroom')
      .values(entities)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  async find(dto: ClassroomGetListDTO) {
    const { page, limit, yearId, gradeId } = dto;

    const withYear = Boolean(yearId);
    const withGrade = Boolean(gradeId);

    const query = this.database
      .selectFrom('classroom')
      .select(['classroom.id', 'classroom.name', 'classroom.gradeId'])
      .where('classroom.deletedAt', 'is', null)
      .$if(withYear, (query) =>
        query.select((eb) => [
          jsonArrayFrom(
            eb
              .selectFrom('classroomYear')
              .whereRef('classroomYear.classroomId', '=', 'classroom.id')
              .where('classroomYear.deletedAt', 'is', null)
              .innerJoin('year', 'year.id', 'classroomYear.yearId')
              .where('year.id', '=', yearId)
              .select(['classroomYear.id']),
          ).as('classroomYears'),
        ]),
      )
      .$if(withGrade, (query) =>
        query
          .innerJoin('grade', 'grade.id', 'classroom.gradeId')
          .where('grade.id', '=', gradeId)
          .where('grade.deletedAt', 'is', null),
      );

    return paginate(query, {
      limit,
      page,
    });
  }

  update(id: string, entity: ClassroomEntity) {
    return this.database
      .updateTable('classroom')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returningAll()
      .executeTakeFirst();
  }

  delete(id: string, entity: ClassroomEntity) {
    return this.database
      .updateTable('classroom')
      .set(entity)
      .where('id', '=', id)
      .returningAll()
      .executeTakeFirst();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('classroom')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: string) {
    const { count } = await this.database
      .selectFrom('classroom')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: string) {
    const { count } = await this.database
      .selectFrom('classroom')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  getIds() {
    return this.database
      .selectFrom('classroom')
      .select(['id'])
      .where('deletedAt', 'is', null)
      .execute();
  }

  getLastInsertedName() {
    return this.database
      .selectFrom('classroom')
      .select(['name'])
      .orderBy('createdAt', 'desc')
      .limit(1)
      .executeTakeFirst();
  }
}
