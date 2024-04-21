import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, MinDate } from 'class-validator';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { IsNotBlank } from '../../common/decorator/validator/is-not-blank.validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Transform, Type } from 'class-transformer';

const { NAME, DIFFICULTY_ID, LESSON_ID, DUE_DATE } = UNPROCESSABLE_ENTITY_EXCEPTION.EXERCISE;

export class ExerciseStoreDTO {
  @ApiProperty()
  @IsString()
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  name: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: DIFFICULTY_ID.IS_NOT_EMPTY })
  difficultyId: number;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: LESSON_ID.IS_NOT_EMPTY })
  lessonId: number;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  time?: number;

  @ApiPropertyOptional()
  @MinDate(new Date('2010-01-01'))
  @MaxDate(new Date('2500-01-01'))
  @IsDate()
  @IsNotEmpty({ message: DUE_DATE.IS_NOT_EMPTY })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dueDate?: Date;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  instantMark: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  allowRedo: boolean;
}

export class ExerciseGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  includeGrade?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  isSubmitted?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  isMissing?: boolean;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  isLate?: boolean;
}

export class ExerciseUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsNotBlank({}, { message: NAME.IS_NOT_EMPTY })
  @IsOptional()
  name: string;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @IsOptional()
  time?: number;

  @ApiPropertyOptional()
  @MinDate(new Date('2010-01-01'))
  @MaxDate(new Date('2500-01-01'))
  @IsDate()
  @IsNotEmpty({ message: DUE_DATE.IS_NOT_EMPTY })
  @IsOptional()
  @Transform(({ value }) => new Date(value))
  dueDate?: Date;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty({ message: DIFFICULTY_ID.IS_NOT_EMPTY })
  difficultyId: number;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  allowRedo: boolean;

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsNotEmpty()
  instantMark: boolean;
}

export class ExerciseGetDetailDTO {
  @ApiProperty()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  includeGrade?: boolean;
}
