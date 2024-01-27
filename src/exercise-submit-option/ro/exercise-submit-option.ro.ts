import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExerciseSubmitOptionUpsertRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  questionId: number;

  @ApiProperty()
  @Expose()
  questionOptionId: number;

  @ApiProperty()
  @Expose()
  exerciseSubmitId: number;

  constructor(data?: ExerciseSubmitOptionUpsertRO) {
    Object.assign(this, data);
  }
}
