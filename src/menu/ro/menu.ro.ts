import { Expose, Type } from 'class-transformer';
import { ApiProperty } from '@nestjs/swagger';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class MenuGetListDataRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  route: string;
}

export class MenuGetListRO extends PaginateRO<MenuGetListDataRO> {
  @ApiProperty({ type: [MenuGetListDataRO] })
  @Type(() => MenuGetListDataRO)
  @Expose()
  override data: MenuGetListDataRO[];
}
