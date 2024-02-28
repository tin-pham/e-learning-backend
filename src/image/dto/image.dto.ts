import { ApiProperty } from '@nestjs/swagger';
import { IsString } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { IMAGE_MIME } from '../../common/constant/mime-type.constant';

export class ImageStoreDTO {
  @ApiProperty({ type: [String], format: 'binary' })
  @HasMimeType(IMAGE_MIME, { each: true })
  @MaxFileSize(3 * 1024 * 1024, { each: true })
  @IsFiles()
  files: MemoryStoredFile[];

  @ApiProperty()
  @IsString()
  directoryPath?: string;
}
