import { Injectable } from '@nestjs/common';
import { DatabaseService, KyselyTables } from '../database';
import { YearEntity } from './year.entity';
import { BaseRepository } from '../base/base.repository';

@Injectable()
export class YearRepository extends BaseRepository<YearEntity> {
  protected override tableName = 'year' as keyof KyselyTables;
  constructor(database: DatabaseService) {
    super(database);
  }

  getLastEndDate() {
    return this.database
      .selectFrom('year')
      .select(['endDate'])
      .orderBy('endDate', 'desc')
      .limit(1)
      .executeTakeFirst();
  }
}
