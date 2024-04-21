import { ApiProperty } from '@nestjs/swagger';
import { Expose } from 'class-transformer';

export class StudentExerciseGradeCalculateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  point: number;

  @ApiProperty()
  @Expose()
  basePoint: number;

  @ApiProperty()
  @Expose()
  totalCount: number;

  @ApiProperty()
  @Expose()
  correctCount: number;

  @ApiProperty()
  @Expose()
  studentExerciseId: number;

  constructor(data?: StudentExerciseGradeCalculateRO) {
    Object.assign(this, data);
  }
}

export class StudentExerciseGradeDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  constructor(data?: StudentExerciseGradeDeleteRO) {
    Object.assign(this, data);
  }
}
