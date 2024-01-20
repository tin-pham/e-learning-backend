import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';

export class LessonAttachmentBulkStoreDTO {
  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  lessonIds: number[];

  @ApiProperty({ type: [Number] })
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  attachmentIds: number[];
}

export class LessonAttachmentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  lessonIds: number[];

  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  attachmentIds: number[];
}
