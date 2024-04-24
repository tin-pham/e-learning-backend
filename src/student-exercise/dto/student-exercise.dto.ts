import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { PaginateDTO } from 'src/common/dto/paginate.dto';

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
  snapshotOptionIds?: number[];
}

export class StudentExerciseSubmitDTO {
  @ApiProperty({ type: [StudentExerciseSubmitSnapshotQuestionDTO] })
  @Type(() => StudentExerciseSubmitSnapshotQuestionDTO)
  @IsArray()
  snapshotQuestions: StudentExerciseSubmitSnapshotQuestionDTO[];
}

export class StudentExerciseGetListSubmittedDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  exerciseId: number;
}

export class StudentExerciseBulkDeleteDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsNotEmpty()
  exerciseId: number;
}
