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

export class StudentExerciseGradeBulkCalculateDTO {
  @ApiProperty()
  @IsNumber()
  basePoint: number;

  @ApiProperty()
  @IsNumber()
  exerciseId: number;
}

export class StudentExerciseGradeDeleteAllDTO {
  @ApiProperty()
  @IsNumber()
  exerciseId: number;
}
