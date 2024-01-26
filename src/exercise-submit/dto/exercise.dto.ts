import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ExerciseSubmitStoreDTO {
  @ApiProperty()
  @IsNumber()
  exerciseId: number;

  @ApiProperty()
  @IsNumber()
  studentId: number;
}
