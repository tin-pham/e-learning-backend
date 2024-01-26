import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { SubmitEntity } from './submit.entity';
import { SubmitGetListDTO } from './dto/submit.dto';
import { paginate } from '../common/function/paginate';

@Injectable()
export class SubmitRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: SubmitEntity) {
    return this.database.insertInto('submit').values(entity).returning(['id', 'exerciseId']).executeTakeFirst();
  }

  find(dto: SubmitGetListDTO) {
    const { page, limit } = dto;

    const query = this.database.selectFrom('submit').select(['id', 'exerciseId']).where('deletedAt', 'is', null);

    return paginate(query, { page, limit });
  }
}
