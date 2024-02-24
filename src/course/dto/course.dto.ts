import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';
import { Transform, Type } from 'class-transformer';

const { NAME, DESCRIPTION, IMAGE_ID, CATEGORY_ID } = UNPROCESSABLE_ENTITY_EXCEPTION.COURSE;

export class CourseStoreDTO {
  @ApiProperty()
  @IsString({
    message: NAME.FORMAT_IS_NOT_VALID,
  })
  @IsNotEmpty({ message: NAME.IS_NOT_EMPTY })
  name: string;

  @ApiPropertyOptional()
  @IsString({
    message: DESCRIPTION.FORMAT_IS_NOT_VALID,
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber(
    {},
    {
      message: IMAGE_ID.FORMAT_IS_NOT_VALID,
    },
  )
  @Type(() => Number)
  @IsOptional()
  imageId?: number;

  @ApiPropertyOptional({
    example: [1, 2, 3],
  })
  @IsNumber(
    {},
    {
      each: true,
      message: CATEGORY_ID.FORMAT_IS_NOT_VALID,
    },
  )
  @IsArray({
    message: CATEGORY_ID.FORMAT_IS_NOT_VALID,
  })
  @IsOptional()
  categoryIds?: number[];
}

export class CourseGetListDTO extends PaginateDTO {
  @ApiPropertyOptional({ example: 1 })
  @IsString()
  @IsOptional()
  userId?: number;

  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => (value === 'null' ? null : value))
  @IsOptional()
  categoryId: number;
}

export class CourseGetDetailDTO {
  @ApiPropertyOptional()
  @Type(() => Boolean)
  @IsOptional()
  withCategoryIds?: boolean;
}

export class CourseUpdateDTO {
  @ApiPropertyOptional()
  @IsString({
    message: NAME.FORMAT_IS_NOT_VALID,
  })
  @IsNotEmpty({
    message: NAME.IS_NOT_EMPTY,
  })
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString({
    message: DESCRIPTION.FORMAT_IS_NOT_VALID,
  })
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsNumber(
    {},
    {
      message: IMAGE_ID.FORMAT_IS_NOT_VALID,
    },
  )
  @IsOptional()
  imageId?: number;

  @ApiPropertyOptional({ example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  categoryIds: number[];
}
