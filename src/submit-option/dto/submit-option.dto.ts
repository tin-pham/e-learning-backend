import { ApiProperty } from '@nestjs/swagger';
import { IsNumber } from 'class-validator';

export class SubmitOptionStoreDTO {
  @ApiProperty()
  @IsNumber()
  exerciseId: number;

  @ApiProperty()
  @IsNumber()
  questionId: number;

  @ApiProperty()
  @IsNumber()
  questionOptionId: number;
}

export class SubmitOptionUpdateDTO {
  @ApiProperty()
  @IsNumber()
  questionOptionId: number;
}
