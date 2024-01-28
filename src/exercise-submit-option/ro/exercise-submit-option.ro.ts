import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class ExerciseSubmitOptionInsertRO {
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

  constructor(data?: ExerciseSubmitOptionInsertRO) {
    Object.assign(this, data);
  }
}
