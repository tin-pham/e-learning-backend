import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class SectionStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  courseId: number;
}

export class SectionGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  courseId: number;
}

export class SectionGetListRO extends PaginateRO<SectionGetListDataRO> {
  @ApiProperty({ type: [SectionGetListDataRO] })
  @Type(() => SectionGetListDataRO)
  @Expose()
  data: SectionGetListDataRO[];
}

export class SectionGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  courseId: number;
}

export class SectionUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  courseId: number;
}

export class SectionDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
