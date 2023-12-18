import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class GroupStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'A' })
  @Expose()
  name: string;
}

export class GroupGetListDataRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'A' })
  @Expose()
  name: string;
}

export class GroupGetListRO {
  @ApiProperty({ type: [GroupGetListDataRO] })
  @Type(() => GroupGetListDataRO)
  @Expose()
  data: GroupGetListDataRO[];
}

export class GroupUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'A' })
  @Expose()
  name: string;
}
