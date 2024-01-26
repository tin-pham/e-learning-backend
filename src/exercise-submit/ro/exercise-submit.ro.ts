import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExerciseSubmitStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  exerciseId: number;

  @ApiProperty()
  @Expose()
  studentId: string;

  constructor(data?: ExerciseSubmitStoreRO) {
    Object.assign(this, data);
  }
}
