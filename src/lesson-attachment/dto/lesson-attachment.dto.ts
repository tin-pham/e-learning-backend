import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';

export class LessonAttachmentBulkStoreDTO {
  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  lessonIds: number[];

  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  attachmentIds: number[];
}

export class LessonAttachmentBulkDeleteDTO {
  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  lessonIds: number[];

  @ApiProperty()
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  attachmentIds: number[];
}
