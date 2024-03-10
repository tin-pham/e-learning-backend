import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class DifficultyGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DifficultyGetListRO {
  @ApiProperty({ type: [DifficultyGetListDataRO] })
  @Type(() => DifficultyGetListDataRO)
  @Expose()
  data: DifficultyGetListDataRO[];
}
