import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
import { ClassroomYearEntity } from './classroom-year.entity';

@Injectable()
export class ClassroomYearRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultipleWithTransaction(
    transaction: Transaction,
    entities: ClassroomYearEntity[],
  ) {
    return transaction
      .insertInto('classroomYear')
      .values(entities)
      .executeTakeFirstOrThrow();
  }

  deleteMultipleWithTransaction(
    transaction: Transaction,
    ids: string[],
    actorId: string,
  ) {
    return transaction
      .updateTable('classroomYear')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', 'in', ids)
      .executeTakeFirstOrThrow();
  }

  getIdsByYearId(yearId: string) {
    return this.database
      .selectFrom('classroomYear')
      .select(['id'])
      .where('yearId', '=', yearId)
      .where('deletedAt', 'is', null)
      .execute();
  }

  update(id: string, entity: ClassroomYearEntity) {
    return this.database
      .updateTable('classroomYear')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'formTeacherId'])
      .executeTakeFirstOrThrow();
  }

  async countByIds(ids: string[]) {
    const { count } = await this.database
      .selectFrom('classroomYear')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: string) {
    const { count } = await this.database
      .selectFrom('classroomYear')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByFormTeacherIdExceptId(formTeacherId: string, id: string) {
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
