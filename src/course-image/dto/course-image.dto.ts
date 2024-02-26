import { ApiProperty } from '@nestjs/swagger';
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { MIME_TYPES } from '../../common/constant/mime-type.constant';

export class CourseImageUpsertDTO {
  @ApiProperty({ type: [String], format: 'binary' })
  @HasMimeType(MIME_TYPES, { each: true })
  @MaxFileSize(3 * 1024 * 1024, { each: true })
  @IsFiles()
  files: MemoryStoredFile[];
}
