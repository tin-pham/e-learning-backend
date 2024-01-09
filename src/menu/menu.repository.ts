import { paginate } from 'src/common/function/paginate';
import { DatabaseService } from 'src/database';
import { Injectable } from '@nestjs/common';
import { MenuGetListDTO } from './dto/menu.dto';

@Injectable()
export class MenuRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: MenuGetListDTO) {
    const { limit, page, parentId, roleId } = dto;

    const withRole = Boolean(roleId);

    const query = this.database
      .selectFrom('menu')
      .select(['menu.id', 'menu.name', 'menu.route'])
      .orderBy('menu.id')
      .where('menu.deletedAt', 'is', null)
      .$if(withRole, (eb) =>
        eb
          .innerJoin('roleMenu', 'roleMenu.menuId', 'menu.id')
          .where('roleMenu.roleId', '=', roleId)
          .where('roleMenu.deletedAt', 'is', null),
      );

    if (parentId) {
      query.where('menu.parentId', '=', parentId);
    }

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('menu')
      .select(['id', 'name', 'route', 'parentId'])
      .where('deletedAt', 'is', null)
      .where('id', '=', id)
      .executeTakeFirst();
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
