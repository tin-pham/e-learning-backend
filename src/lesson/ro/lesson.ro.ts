import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class LessonStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  sectionId: number;

  @ApiProperty()
  @Expose()
  videoUrl: string;
}

export class LessonGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  body: string;
}

export class LessonGetListRO extends PaginateRO<LessonGetListDataRO> {
  @ApiProperty({ type: [LessonGetListDataRO] })
  @Type(() => LessonGetListDataRO)
  @Expose()
  data: LessonGetListDataRO[];
}

export class LessonGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  sectionId: number;

  @ApiProperty()
  @Expose()
  videoUrl: string;
}

export class LessonUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  sectionId: number;

  @ApiProperty()
  @Expose()
  videoUrl: string;
}

export class LessonDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
