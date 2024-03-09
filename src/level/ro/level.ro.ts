import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class LevelGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class LevelGetListRO {
  @ApiProperty({ type: [LevelGetListDataRO] })
  @Expose()
  @Type(() => LevelGetListDataRO)
  data: LevelGetListDataRO[];
}
