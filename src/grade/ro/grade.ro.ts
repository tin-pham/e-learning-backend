import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class GradeStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty({ example: '6' })
  @Expose()
  name: string;
}

export class GradeGetListDataYearGradeRO {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;
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
  @ApiPropertyOptional()
  @Expose()
  id: number;

  @ApiPropertyOptional({ example: 'Grade 6' })
  @Expose()
  name: string;
}

export class GradeDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
