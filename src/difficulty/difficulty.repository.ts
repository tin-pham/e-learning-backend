import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { DifficultyGetListDTO } from './dto/difficulty.dto';
import { paginate } from 'src/common/function/paginate';

@Injectable()
export class DifficultyRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: DifficultyGetListDTO) {
    const { limit, page } = dto;

    const query = this.database.selectFrom('difficulty').select(['id', 'name']).where('deletedAt', 'is', null).orderBy('id');

    return paginate(query, {
      limit,
      page,
    });
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('difficulty')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .executeTakeFirst();
    return Number(count);
  }
}
