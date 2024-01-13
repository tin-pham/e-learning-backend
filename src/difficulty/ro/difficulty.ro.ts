import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class DifficultyGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class DifficultyGetListRO extends PaginateRO<DifficultyGetListDataRO> {
  @ApiProperty({ type: [DifficultyGetListDataRO] })
  @Type(() => DifficultyGetListDataRO)
  @Expose()
  data: DifficultyGetListDataRO[];
}
