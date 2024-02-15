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

export class SectionGetListDataLessonRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;
}

export class SectionGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty({ type: [SectionGetListDataLessonRO] })
  @Type(() => SectionGetListDataLessonRO)
  @Expose()
  lessons: SectionGetListDataLessonRO[];
}

export class SectionGetListRO extends PaginateRO<SectionGetListDataRO> {
  @ApiProperty({ type: [SectionGetListDataRO] })
  @Type(() => SectionGetListDataRO)
  @Expose()
  data: SectionGetListDataRO[];
}

export class SectionGetDetailLessonRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;
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

  @ApiProperty({ type: [SectionGetDetailLessonRO] })
  @Type(() => SectionGetDetailLessonRO)
  @Expose()
  lessons: SectionGetDetailLessonRO[];
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
