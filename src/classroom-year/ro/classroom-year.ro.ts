import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ClassroomYearUpdateRO {
  @ApiProperty()
  @Expose()
  id: string;

  @ApiProperty()
  @Expose()
  formTeacherId: string;
}
