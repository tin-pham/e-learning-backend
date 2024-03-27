import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { IsNotBlank } from '../../common/decorator/validator/is-not-blank.validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

const { TEXT } = UNPROCESSABLE_ENTITY_EXCEPTION.QUESTION_OPTION;

export class QuestionOptionStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: TEXT.IS_NOT_EMPTY })
  text: string;

  @ApiProperty({ example: false })
  @IsBoolean()
  isCorrect: boolean;

  @ApiProperty({ example: 1 })
  @IsNumber()
  questionId: number;
}

export class QuestionOptionGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  questionId: number;
}

export class QuestionOptionUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsNotBlank({}, { message: TEXT.IS_NOT_EMPTY })
  @IsOptional()
  text?: string;

  @ApiPropertyOptional()
  @IsBoolean()
  @IsOptional()
  isCorrect?: boolean;
}

export class QuestionOptionBulkUpdateDataDTO {
  @ApiProperty()
  @IsNumber()
  @IsNotEmpty()
  id: number;

  @ApiProperty({ type: QuestionOptionUpdateDTO })
  @IsNotEmpty()
  @Type(() => QuestionOptionUpdateDTO)
  dto: QuestionOptionUpdateDTO;
}

export class QuestionOptionBulkUpdateDTO {
  @ApiProperty({ type: [QuestionOptionBulkUpdateDataDTO] })
  @IsArray()
  @ArrayMinSize(1)
  @Type(() => QuestionOptionBulkUpdateDataDTO)
  data: QuestionOptionBulkUpdateDataDTO[];
}
