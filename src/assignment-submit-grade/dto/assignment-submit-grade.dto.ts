import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber, IsOptional, IsString, Max, Min } from 'class-validator';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';

const { GRADE } = UNPROCESSABLE_ENTITY_EXCEPTION.ASSIGNMENT_SUBMIT_GRADE;

export class AssignmentSubmitGradeStoreDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  assignmentSubmitId: number;

  @ApiProperty()
  @Max(100, { message: GRADE.MAX_IS_100 })
  @Min(0, { message: GRADE.MIN_IS_0 })
  @IsNumber()
  @IsNotEmpty({ message: GRADE.IS_NOT_EMPTY })
  grade: number;

  @ApiProperty()
  @IsString()
  @IsOptional()
  message?: string;
}
