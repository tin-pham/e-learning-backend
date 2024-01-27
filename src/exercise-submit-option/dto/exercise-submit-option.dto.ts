import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class ExerciseSubmitOptionUpsertDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  questionId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  questionOptionId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  exerciseSubmitId: number;
}
