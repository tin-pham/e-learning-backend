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
  levelId?: number;

  @ApiProperty()
  @Expose()
  hours?: number;
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
  imageUrl?: string;

  @ApiProperty()
  @Expose()
  levelId: number;

  @ApiProperty()
  @Expose()
  levelName: string;

  @ApiProperty()
  @Expose()
  unsubmittedPendingCount?: number;

  @ApiProperty()
  @Expose()
  hours: number;

  @ApiProperty()
  @Expose()
  studentCount: number;
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
  description?: object;

  @ApiProperty()
  @Expose()
  levelId: number;

  @ApiProperty()
  @Expose()
  levelName: string;

  @ApiProperty()
  @Expose()
  imageUrl?: string;

  @ApiProperty({ type: [Number] })
  @Expose()
  categoryIds: number[];

  @ApiProperty()
  @Expose()
  hours: number;

  @ApiProperty()
  @Expose()
  lessonCount: number;

  @ApiProperty()
  @Expose()
  sectionCount: number;

  @ApiProperty()
  @Expose()
  createdBy: number;
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
  levelId: number;

  @ApiProperty()
  @Expose()
  hours: number;
}

export class CourseDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}

export class CourseTeacherGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  imageUrl: string;

  @ApiProperty()
  @Expose()
  levelName: string;

  @ApiProperty()
  @Expose()
  levelId: number;

  @ApiProperty()
  @Expose()
  hours: number;

  @ApiProperty()
  @Expose()
  studentCount: number;
}

export class CourseTeacherGetListRO extends PaginateRO<CourseTeacherGetListDataRO> {
  @ApiProperty({ type: [CourseTeacherGetListDataRO] })
  @Type(() => CourseTeacherGetListDataRO)
  @Expose()
  data: CourseTeacherGetListDataRO[];
}
