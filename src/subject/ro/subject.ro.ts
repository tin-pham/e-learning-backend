import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class SubjectStoreRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'Math' })
  @Expose()
  name: string;
}

export class SubjectGetListDataGroupRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'A1' })
  @Expose()
  name: string;
}

export class SubjectGetListDataRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'Math' })
  @Expose()
  name: string;

  @ApiPropertyOptional({ type: [SubjectGetListDataGroupRO] })
  @Type(() => SubjectGetListDataGroupRO)
  @Expose()
  groups: SubjectGetListDataGroupRO[];
}

export class SubjectGetListRO extends PaginateRO<SubjectGetListDataRO> {
  @ApiProperty({ type: [SubjectGetListDataRO] })
  @Type(() => SubjectGetListDataRO)
  @Expose()
  data: SubjectGetListDataRO[];
}

export class SubjectUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty({ example: 'Math' })
  @Expose()
  name: string;
}
