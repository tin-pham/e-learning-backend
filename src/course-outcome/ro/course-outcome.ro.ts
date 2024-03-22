import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class CourseOutcomeGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;
}

export class CourseOutcomeGetListRO {
  @ApiProperty({ type: [CourseOutcomeGetListDataRO] })
  @Type(() => CourseOutcomeGetListDataRO)
  @Expose()
  data: CourseOutcomeGetListDataRO[];
}

export class CourseOutcomeStoreRO {
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

export class CourseOutcomeUpdateRO {
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

export class CourseOutcomeDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
