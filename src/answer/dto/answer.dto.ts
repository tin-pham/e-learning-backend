import { ApiProperty } from '@nestjs/swagger';
import { IsNotEmpty, IsNumber } from 'class-validator';

export class AnswerStoreDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  questionOptionId: number;

  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  questionId: number;
}

export class AnswerUpdateDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  questionOptionId: number;
}
