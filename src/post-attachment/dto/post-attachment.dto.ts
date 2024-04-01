import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNotEmpty, IsNumber } from 'class-validator';
import { IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';

export class PostAttachmentBulkStoreDTO {
  @ApiProperty({ type: [String], format: 'binary' })
  @MaxFileSize(3 * 1024 * 1024, { each: true })
  @IsFiles()
  files: MemoryStoredFile[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  @IsNotEmpty()
  @Type(() => Number)
  postId: number;
}

export class PostAttachmentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  attachmentIds: number[];
}
