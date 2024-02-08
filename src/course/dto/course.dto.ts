import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNotEmpty, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from 'src/common';
import { Transform } from 'class-transformer';

const { NAME, DESCRIPTION, IMAGE_URL, CATEGORY_ID, STUDENT_ID } = UNPROCESSABLE_ENTITY_EXCEPTION.COURSE;

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
  @IsUrl(
    {},
    {
      message: IMAGE_URL.FORMAT_IS_NOT_VALID,
    },
  )
  @IsOptional()
  imageUrl?: string;

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
  @ApiPropertyOptional({ example: 'STU-001' })
  @IsString({
    message: STUDENT_ID.FORMAT_IS_NOT_VALID,
  })
  @IsOptional()
  studentId?: string;

  @ApiPropertyOptional({ example: 1 })
  @Transform(({ value }) => (value === 'null' ? null : value))
  @IsOptional()
  categoryId: number;
}

export class CourseUpdateDTO {
  @ApiPropertyOptional()
  @IsString({
    message: NAME.FORMAT_IS_NOT_VALID,
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
  @IsString({
    message: IMAGE_URL.FORMAT_IS_NOT_VALID,
  })
  @IsOptional()
  imageUrl?: string;

  @ApiPropertyOptional({ example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  addCategoryIds?: number[];

  @ApiPropertyOptional({ example: [1] })
  @IsNumber({}, { each: true })
  @IsArray()
  @IsOptional()
  removeCategoryIds?: number[];
}
