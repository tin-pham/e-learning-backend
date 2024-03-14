import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class StudentExerciseStoreDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  exerciseId: number;
}

export class StudentExerciseSubmitSnapshotQuestionDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  id: number;

  @ApiProperty({ type: [Number], example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  snapshotOptionIds: number[];
}

export class StudentExerciseSubmitDTO {
  @ApiProperty({ type: [StudentExerciseSubmitSnapshotQuestionDTO] })
  @Type(() => StudentExerciseSubmitSnapshotQuestionDTO)
  @IsArray()
  snapshotQuestions: StudentExerciseSubmitSnapshotQuestionDTO[];
}
