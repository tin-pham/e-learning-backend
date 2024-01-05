import { Injectable } from '@nestjs/common';
import { DatabaseService, KyselyTables, Transaction } from '../database';
import { YearEntity } from './year.entity';
import { BaseRepository } from '../base/base.repository';
import { paginate } from '../common/function/paginate';
import { YearGetListDTO } from './dto/year.dto';

@Injectable()
export class YearRepository extends BaseRepository<YearEntity> {
  protected override tableName = 'year' as keyof KyselyTables;
  constructor(database: DatabaseService) {
    super(database);
  }

  insertWithTransaction(transaction: Transaction, entity: YearEntity) {
    return transaction
      .insertInto('year')
      .values(entity)
      .returningAll()
      .executeTakeFirstOrThrow();
  }

  deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    return transaction
      .updateTable('year')
      .set({
        deletedAt: new Date(),
        deletedBy: actorId,
      })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirstOrThrow();
  }

  getLastEndDate() {
    return this.database
      .selectFrom('year')
      .select(['endDate'])
      .where('deletedAt', 'is', null)
      .orderBy('endDate', 'desc')
      .limit(1)
      .executeTakeFirst();
  }

  find(dto: YearGetListDTO) {
    const query = this.database
      .selectFrom('year')
      .select(['id', 'name', 'startDate', 'endDate'])
      .where('deletedAt', 'is', null);

    return paginate(query, {
      limit: dto.limit,
      page: dto.page,
    });
  }
}
