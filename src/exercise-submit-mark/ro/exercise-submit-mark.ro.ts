import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExerciseSubmitMarkCalculateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  point: number;

  @ApiProperty()
  @Expose()
  totalCount: number;

  @ApiProperty()
  @Expose()
  correctCount: number;

  @ApiProperty()
  @Expose()
  exerciseSubmitId: number;

  constructor(data?: ExerciseSubmitMarkCalculateRO) {
    Object.assign(this, data);
  }
}
