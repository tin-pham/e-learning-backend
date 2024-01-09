import { paginate } from 'src/common/function/paginate';
import { DatabaseService } from 'src/database';
import { Injectable } from '@nestjs/common';
import { MenuGetListDTO } from './dto/menu.dto';

@Injectable()
export class MenuRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: MenuGetListDTO) {
    const { limit, page, parentId } = dto;

    const query = this.database.selectFrom('menu').select(['name', 'route']).orderBy('name').where('deletedAt', 'is', null);

    if (parentId) {
      query.where('parentId', '=', parentId);
    }

    return paginate(query, { limit, page });
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('menu')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
