import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CourseStudentRegisterRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  courseId: number;

  @ApiProperty()
  @Expose()
  studentId: string;
}

export class CourseStudentUnRegisterRO {
  @ApiProperty()
  @Expose()
  id: number;
}
