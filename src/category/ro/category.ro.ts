import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class CategoryStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  constructor(data?: CategoryStoreRO) {
    Object.assign(this, data);
  }
}

export class CategoryGetListDataCourseImageRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
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
  imageId: number;

  @ApiProperty({ type: CategoryGetListDataCourseImageRO })
  @Type(() => CategoryGetListDataCourseImageRO)
  @Expose()
  image: CategoryGetListDataCourseImageRO;
}

export class CategoryGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

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
  description: object;

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

  constructor(data?: CategoryUpdateRO) {
    Object.assign(this, data);
  }
}
