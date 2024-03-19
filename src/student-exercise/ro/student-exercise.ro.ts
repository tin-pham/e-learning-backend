import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StudentExerciseStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  startDoingAt: Date;
}
