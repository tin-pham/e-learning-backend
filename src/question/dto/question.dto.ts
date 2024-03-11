import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';

const { TEXT, DIFFICULTY_ID } = UNPROCESSABLE_ENTITY_EXCEPTION.QUESTION;

export class QuestionStoreOptionDTO {
  @ApiProperty()
  @IsString()
  text: string;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  isCorrect: boolean = false;
}

export class QuestionStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotEmpty({
    message: TEXT.IS_NOT_EMPTY,
  })
  text: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({
    message: DIFFICULTY_ID.IS_NOT_EMPTY,
  })
  difficultyId: number;

  @ApiProperty({ example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  questionCategoryIds?: number[];

  @ApiProperty({ type: [QuestionStoreOptionDTO] })
  @ArrayMinSize(1)
  @IsArray()
  @Type(() => QuestionStoreOptionDTO)
  @IsOptional()
  options?: QuestionStoreOptionDTO[];
}

export class QuestionGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  questionCategoryId?: number;
}

export class QuestionUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  difficultyId?: number;

  @ApiProperty({ example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  questionCategoryIds?: number[];
}
