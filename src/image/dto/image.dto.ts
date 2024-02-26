import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { MIME_TYPES } from '../../common/constant/mime-type.constant';

export class ImageStoreDTO {
  @ApiProperty({ type: [String], format: 'binary' })
  @HasMimeType(MIME_TYPES, { each: true })
  @MaxFileSize(3 * 1024 * 1024, { each: true })
  @IsFiles()
  files: MemoryStoredFile[];

  @ApiProperty()
  @IsString()
  directoryPath?: string;
}
