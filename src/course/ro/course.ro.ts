import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class CourseStoreRO {
  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  description?: string;

  @ApiProperty()
  @Expose()
  imageUrl?: string;
}
