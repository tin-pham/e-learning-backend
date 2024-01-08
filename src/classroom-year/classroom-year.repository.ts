import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { ClassroomYearEntity } from './classroom-year.entity';
import { jsonBuildObject } from 'kysely/helpers/postgres';

@Injectable()
export class ClassroomYearRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultipleWithTransaction(transaction: Transaction, entities: ClassroomYearEntity[]) {
    return transaction.insertInto('classroomYear').values(entities).executeTakeFirstOrThrow();
  }

  deleteMultipleWithTransaction(transaction: Transaction, ids: number[], actorId: number) {
    return transaction
      .updateTable('classroomYear')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', 'in', ids)
      .executeTakeFirstOrThrow();
  }

  getIdsByYearId(yearId: number) {
    return this.database.selectFrom('classroomYear').select(['id']).where('yearId', '=', yearId).where('deletedAt', 'is', null).execute();
  }

  update(id: number, entity: ClassroomYearEntity) {
    return this.database
      .updateTable('classroomYear')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'formTeacherId'])
      .executeTakeFirstOrThrow();
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('classroomYear')
      .select(['classroomYear.id', 'formTeacherId'])
      .where('classroomYear.id', '=', id)
      .where('classroomYear.deletedAt', 'is', null)
      .leftJoin('teacher', 'teacher.id', 'classroomYear.formTeacherId')
      .leftJoin('users', 'users.id', 'teacher.userId')
      .select(({ ref }) => [
        jsonBuildObject({
          id: ref('teacher.id'),
          username: ref('users.username'),
          email: ref('users.email'),
          phone: ref('users.phone'),
          displayName: ref('users.displayName'),
        }).as('formTeacher'),
      ])
      .executeTakeFirst();
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('classroomYear')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('classroomYear')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByFormTeacherIdExceptId(formTeacherId: string, id: number) {
    const { count } = await this.database
      .selectFrom('classroomYear')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('formTeacherId', '=', formTeacherId)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
