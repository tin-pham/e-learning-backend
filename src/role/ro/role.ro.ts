import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class RoleGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class RoleGetListRO {
  @ApiProperty({ type: [RoleGetListDataRO] })
  @Type(() => RoleGetListDataRO)
  @Expose()
  data: RoleGetListDataRO[];
}
