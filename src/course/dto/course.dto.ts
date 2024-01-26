import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsOptional, IsString, IsUrl } from 'class-validator';
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
}
