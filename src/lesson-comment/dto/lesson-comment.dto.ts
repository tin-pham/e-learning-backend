import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { IsNumber, IsOptional, IsString } from 'class-validator';
import { Type } from 'class-transformer';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class LessonCommentStoreDTO {
  @ApiProperty()
  @IsNumber()
  lessonId: number;

  @ApiProperty()
  @IsString()
  body: string;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  parentId?: number;
}

export class LessonCommentGetListDTO extends PaginateDTO {
  @ApiProperty()
  @IsNumber()
  @Type(() => Number)
  lessonId: number;
}

export class LessonCommentUpdateDTO {
  @ApiProperty()
  @IsString()
  body: string;
}
