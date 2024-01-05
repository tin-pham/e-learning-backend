import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class ClassroomStoreRO {
  @Expose()
  @ApiProperty()
  id: number;

  @Expose()
  @ApiProperty({ example: 'A' })
  name: string;

  @Expose()
  @ApiProperty()
  gradeId: number;
}

export class ClassroomGetListDataClassroomYearRO {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;
}

export class ClassroomGetListDataRO {
  @ApiProperty({ example: 1 })
  @Expose()
  id: number;

  @ApiProperty({ example: 'Grade 6' })
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  gradeId: number;

  @ApiPropertyOptional({ type: [ClassroomGetListDataClassroomYearRO] })
  @Type(() => ClassroomGetListDataClassroomYearRO)
  @Expose()
  classroomYears: ClassroomGetListDataClassroomYearRO[];
}

export class ClassroomGetListRO extends PaginateRO<ClassroomGetListDataRO> {
  @ApiProperty({ type: [ClassroomGetListDataRO] })
  @Type(() => ClassroomGetListDataRO)
  @Expose()
  data: ClassroomGetListDataRO[];
}

export class ClassroomDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;
}
