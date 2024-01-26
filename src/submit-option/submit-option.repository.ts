import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { SubmitOptionEntity } from './submit-option.entity';

@Injectable()
export class SubmitOptionRepository {
  constructor(private readonly database: DatabaseService) {}

  getQuestionIdById(id: number) {
    return this.database
      .selectFrom('submitOption')
      .select(['questionId'])
      .where('submitOption.id', '=', id)
      .where('deletedAt', '=', null)
      .executeTakeFirst();
  }

  insert(entity: SubmitOptionEntity) {
    return this.database.insertInto('submitOption').values(entity).returning(['id', 'questionId', 'questionOptionId']).executeTakeFirst();
  }

  update(id: number, entity: SubmitOptionEntity) {
    return this.database
      .updateTable('submitOption')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'questionOptionId'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('submitOption')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('submitOption.id', '=', id)
      .where('deletedAt', '=', null)
      .executeTakeFirst();
    return Number(count);
  }
}
