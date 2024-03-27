import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsBoolean, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { Transform, Type } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { IsNotBlank } from 'src/common/decorator/validator/is-not-blank.validator';

const { TEXT, DIFFICULTY_ID, OPTIONS } = UNPROCESSABLE_ENTITY_EXCEPTION.QUESTION;
const { TEXT: OPTION_TEXT } = UNPROCESSABLE_ENTITY_EXCEPTION.QUESTION_OPTION;

export class QuestionStoreOptionDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: OPTION_TEXT.IS_NOT_EMPTY })
  text: string;

  @ApiProperty()
  @IsBoolean()
  @Type(() => Boolean)
  isCorrect: boolean = false;
}

export class QuestionStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({ message: TEXT.IS_NOT_EMPTY })
  text: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: DIFFICULTY_ID.IS_NOT_EMPTY })
  difficultyId: number;

  @ApiProperty({ example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  questionCategoryIds?: number[];

  @ApiProperty({ type: [QuestionStoreOptionDTO] })
  @ArrayMinSize(2, { message: OPTIONS.AT_LEAST_TWO_OPTION_IS_REQUIRED })
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

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  exerciseId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  excludeExerciseId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  difficultyId: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  withExerciseStudentOption?: boolean;
}

export class QuestionStudentGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  exerciseId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  studentExerciseId?: number;
}

export class QuestionUpdateOptionDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  text?: string;
}

export class QuestionUpdateOptionRO {
  @ApiPropertyOptional()
  @IsBoolean()
  isCorrect: boolean;

  @ApiPropertyOptional()
  @IsString()
  @IsNotBlank({}, { message: OPTION_TEXT.IS_NOT_EMPTY })
  text: string;
}

export class QuestionUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsNotBlank({}, { message: TEXT.IS_NOT_EMPTY })
  @IsOptional()
  text?: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  difficultyId?: number;

  @ApiPropertyOptional({ type: [QuestionUpdateOptionDTO] })
  @IsArray()
  @IsOptional()
  @Type(() => QuestionUpdateOptionDTO)
  options: QuestionUpdateOptionRO[];

  @ApiPropertyOptional({ example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  removeOptionIds: number[];
}
