import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class GradeStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: '6' })
  @Expose()
  name: string;
}

export class GradeGetListDataRO {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Grade 6' })
  @Expose()
  name: string;
}

export class GradeGetListRO extends PaginateRO<GradeGetListDataRO> {
  @ApiProperty({ type: [GradeGetListDataRO] })
  @Type(() => GradeGetListDataRO)
  @Expose()
  data: GradeGetListDataRO[];
}

export class GradeUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'Grade 6' })
  @Expose()
  name: string;
}

export class GradeDeleteRO {
  @ApiProperty()
  @Expose()
  id: string;
}
