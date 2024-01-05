import { IsOptional, IsString } from 'class-validator';
import {
  HasMimeType,
  IsFiles,
  MaxFileSize,
  MemoryStoredFile,
} from 'nestjs-form-data';

export class S3UploadFilesDTO {
  @IsFiles()
  @MaxFileSize(3 * 1024 * 1024, { each: true })
  @HasMimeType(['image/jpeg', 'image/png', 'image/webp', 'image/jpg'], {
    each: true,
  })
  files: MemoryStoredFile[];

  @IsString()
  @IsOptional()
  directoryPath?: string;
}
