import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber, IsString, IsUrl } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';
import { PaginateDTO } from 'src/common/dto/paginate.dto';
import { Type } from 'class-transformer';

export class LessonAttachmentBulkStoreFileDTO {
  @ApiProperty({ example: 'https://example.com' })
  @IsUrl()
  url: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  name: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  size: string;

  @ApiProperty()
  @IsString()
  @IsNotEmpty()
  type: string;
}

export class LessonAttachmentBulkStoreDTO {
  @ApiProperty({ type: [LessonAttachmentBulkStoreFileDTO] })
  @IsArray()
  @ArrayMinSize(1)
  @IsNotEmpty()
  @Type(() => LessonAttachmentBulkStoreFileDTO)
  files: LessonAttachmentBulkStoreFileDTO[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  lessonId: number;
}

export class LessonAttachmentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  ids: number[];
}

export class LessonAttachmentGetListDTO extends PaginateDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  lessonId: number;
}
