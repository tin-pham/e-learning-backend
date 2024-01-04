import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class ClassroomYearUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  formTeacherId: string;
}

export class ClassroomYearGetDetailFormTeacherRO {
  @ApiProperty()
  @Expose()
  id: string;

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
  id: string;

  @ApiPropertyOptional({ type: ClassroomYearGetDetailFormTeacherRO })
  @Type(() => ClassroomYearGetDetailFormTeacherRO)
  @Expose()
  formTeacher?: ClassroomYearGetDetailFormTeacherRO;
}
