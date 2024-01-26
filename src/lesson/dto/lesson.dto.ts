import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { Type } from 'class-transformer';

export class LessonStoreDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty({ example: 1 })
  @IsNumber()
  sectionId: number;

  @ApiPropertyOptional()
  @IsUrl()
  @IsOptional()
  videoUrl?: string;
}

export class LessonGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  sectionId?: number;
}

export class LessonUpdateDTO {
  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  body?: string;

  @ApiProperty()
  @IsUrl()
  videoUrl: string;
}
