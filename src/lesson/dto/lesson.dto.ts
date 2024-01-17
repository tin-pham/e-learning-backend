import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString, IsUrl } from 'class-validator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class LessonStoreDTO {
  @ApiProperty()
  @IsString()
  title: string;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiProperty()
  @IsNumber()
  sectionId: number;

  @ApiProperty()
  @IsUrl()
  videoUrl: string;
}

export class LessonGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
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
