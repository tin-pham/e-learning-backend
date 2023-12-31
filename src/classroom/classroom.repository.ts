import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { paginate } from '../common/function/paginate';
import { ClassroomEntity } from './classroom.entity';
import { ClassroomGetListDTO } from './dto/classroom.dto';

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
    const withGrade = Boolean(dto.gradeId);
    const withYear = Boolean(dto.yearId);

    const query = this.database
      .selectFrom('classroom')
      .select(['classroom.id', 'classroom.name', 'classroom.gradeId'])
      .where('classroom.deletedAt', 'is', null)
      .$if(withGrade, (query) =>
        query
          .innerJoin('grade', 'grade.id', 'classroom.gradeId')
          .where('grade.deletedAt', 'is', null)
          .where('grade.id', '=', dto.gradeId),
      )
      .$if(withYear, (query) =>
        query
          .innerJoin(
            'classroomYear',
            'classroomYear.classroomId',
            'classroom.id',
          )
          .innerJoin('year', 'year.id', 'classroomYear.yearId')
          .where('year.deletedAt', 'is', null)
          .where('year.id', '=', dto.yearId)
          .select('classroomYear.id as classroomYearId'),
      );

    const response = await paginate(query, {
      limit: dto.limit,
      page: dto.page,
    });
    response.data = response.data.map(
      (classroom) => new ClassroomEntity(classroom),
    );

    return response;
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
