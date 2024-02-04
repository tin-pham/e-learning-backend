import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class CategoryStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  constructor(data?: CategoryStoreRO) {
    Object.assign(this, data);
  }
}

export class CategoryGetListDataCourseRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiProperty()
  @Expose()
  imageUrl: string;
}

export class CategoryGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  @ApiPropertyOptional({ type: [CategoryGetListDataCourseRO] })
  @Type(() => CategoryGetListDataCourseRO)
  @Expose()
  courses?: CategoryGetListDataCourseRO[];

  @ApiPropertyOptional()
  @Expose()
  courseCount?: number;
}

export class CategoryGetListRO extends PaginateRO<CategoryGetListDataRO> {
  @ApiProperty({ type: [CategoryGetListDataRO] })
  @Type(() => CategoryGetListDataRO)
  @Expose()
  data: CategoryGetListDataRO[];
}

export class CategoryGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  constructor(data?: CategoryGetDetailRO) {
    Object.assign(this, data);
  }
}

export class CategoryUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description: string;

  constructor(data?: CategoryUpdateRO) {
    Object.assign(this, data);
  }
}

export class CategoryDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  constructor(data?: CategoryDeleteRO) {
    Object.assign(this, data);
  }
}