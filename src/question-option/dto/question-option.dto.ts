import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class QuestionOptionStoreDTO {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty()
  @IsNumber()
  questionId: number;
}

export class QuestionOptionGetListDTO extends PaginateDTO {
  @ApiProperty()
  @IsNumber()
  questionId: number;
}

export class QuestionOptionUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;
}
