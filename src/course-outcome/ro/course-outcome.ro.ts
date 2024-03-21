import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

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
