import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class StudentExerciseGradeCalculateDTO {
  @ApiProperty()
  @IsNumber()
  studentExerciseId: number;

  @ApiProperty()
  @IsNumber()
  basePoint: number;
}
