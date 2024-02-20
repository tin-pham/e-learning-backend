import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class CourseStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  imageId?: number;
}

export class CourseGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  imageId?: number;
}

export class CourseGetListRO extends PaginateRO<CourseGetListDataRO> {
  @ApiProperty({ type: [CourseGetListDataRO] })
  @Type(() => CourseGetListDataRO)
  @Expose()
  data: CourseGetListDataRO[];
}

export class CourseGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  imageId?: number;

  @ApiProperty({ type: [Number] })
  @Expose()
  categoryIds: number[];
}

export class CourseUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  imageId?: number;
}

export class CourseDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
