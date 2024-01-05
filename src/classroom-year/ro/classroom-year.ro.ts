import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ClassroomYearUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  formTeacherId: string;
}

export class ClassroomYearGetDetailFormTeacherRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  email: string;

  @ApiProperty()
  @Expose()
  phone: string;

  @ApiProperty()
  @Expose()
  displayName: string;
}

export class ClassroomYearGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiPropertyOptional({ type: ClassroomYearGetDetailFormTeacherRO })
  @Type(() => ClassroomYearGetDetailFormTeacherRO)
  @Expose()
  formTeacher?: ClassroomYearGetDetailFormTeacherRO;
}
