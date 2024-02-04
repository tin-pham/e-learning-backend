import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsArray, IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class CourseStoreDTO {
  @ApiProperty()
  @IsString()
  name: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  imageUrl?: string;
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  categoryId?: number;
}

export class CourseGetListDTO extends PaginateDTO {
  @ApiPropertyOptional({ example: 'STU-001' })
  @IsString()
  @IsOptional()
  studentId?: string;
}

export class CourseUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional()
  @IsString()
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
