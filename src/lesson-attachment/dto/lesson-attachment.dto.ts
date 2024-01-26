import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsUrl } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';

export class LessonAttachmentBulkStoreDTO {
  @ApiProperty()
  @IsUrl({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  urls: string[];

  @ApiProperty()
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
