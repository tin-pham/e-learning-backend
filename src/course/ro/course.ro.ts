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

export class CourseGetListImageRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
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

  @ApiProperty()
  @Expose()
  image?: CourseGetListImageRO;
}

export class CourseGetListRO extends PaginateRO<CourseGetListDataRO> {
  @ApiProperty({ type: [CourseGetListDataRO] })
  @Type(() => CourseGetListDataRO)
  @Expose()
  data: CourseGetListDataRO[];
}

export class CourseGetDetailImageRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
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

  @ApiProperty()
  @Expose()
  image?: CourseGetDetailImageRO;

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
