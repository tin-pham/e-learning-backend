import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { ArrayMinSize, IsArray, IsBoolean, IsDate, IsNotEmpty, IsNumber, IsOptional, IsString, MaxDate, MinDate } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

const { NAME, DESCRIPTION, DUE_DATE, LESSON_ID } = UNPROCESSABLE_ENTITY_EXCEPTION.ASSIGNMENT;

export class AssignmentStoreDTO {
  @ApiProperty()
  @IsString({
    message: NAME.FORMAT_IS_NOT_VALID,
  })
  @IsNotEmpty({
    message: NAME.IS_NOT_EMPTY,
  })
  name: string;

  @ApiProperty()
  @IsString({
    message: DESCRIPTION.FORMAT_IS_NOT_VALID,
  })
  @IsNotEmpty({
    message: DESCRIPTION.IS_NOT_EMPTY,
  })
  description: string;

  @ApiProperty()
  @MinDate(new Date('2010-01-01'))
  @MaxDate(new Date('2500-01-01'))
  @IsDate({
    message: DUE_DATE.FORMAT_IS_NOT_VALID,
  })
  @IsNotEmpty({
    message: DUE_DATE.IS_NOT_EMPTY,
  })
  @Transform(({ value }) => new Date(value))
  dueDate: Date;

  @ApiPropertyOptional({ example: 1 })
  @IsNumber(
    {},
    {
      message: LESSON_ID.FORMAT_IS_NOT_VALID,
    },
  )
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;

  @ApiProperty({ example: [1] })
  @ArrayMinSize(1)
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  exerciseIds?: number[];

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  courseId?: number;
}

export class AssignmentGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber(
    {},
    {
      message: LESSON_ID.FORMAT_IS_NOT_VALID,
    },
  )
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  courseId?: number;

  @ApiPropertyOptional()
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  withSubmission?: boolean;
}

export class AssignmentUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description: string;

  @ApiPropertyOptional()
  @MinDate(new Date('2010-01-01'))
  @MaxDate(new Date('2500-01-01'))
  @IsDate()
  @Transform(({ value }) => new Date(value))
  @IsOptional()
  dueDate: Date;
}

export class AssignmentGetMyListDTO extends PaginateDTO {}
