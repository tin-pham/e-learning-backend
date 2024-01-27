import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ExerciseSubmitMarkCalculateDTO {
  @ApiProperty()
  @IsNumber()
  exerciseSubmitId: number;

  @ApiProperty()
  @IsNumber()
  basePoint: number;
}
