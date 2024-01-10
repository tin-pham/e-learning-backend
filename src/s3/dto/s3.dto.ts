import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsOptional, IsString, IsUrl } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';

export class S3UploadDTO {
  @ApiProperty({ type: [String], format: 'binary' })
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'], {
    each: true,
  })
  @MaxFileSize(3 * 1024 * 1024, { each: true })
  @IsFiles()
  files: MemoryStoredFile[];

  @ApiPropertyOptional()
  @IsString()
  @IsOptional()
  directoryPath?: string;
}

export class S3DeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsUrl({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  urls: string[];
}
