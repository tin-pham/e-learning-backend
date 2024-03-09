import { ApiProperty } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';
import { HasMimeType, IsFiles, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';
import { DOCUMENT_MIME, IMAGE_MIME } from '../../common/constant/mime-type.constant';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';

const { FORMAT_IS_NOT_VALID } = UNPROCESSABLE_ENTITY_EXCEPTION.MIME;

export class AssignmentAttachmentBulkStoreDTO {
  @ApiProperty({ type: [String], format: 'binary' })
  @MaxFileSize(3 * 1024 * 1024, { each: true })
  @HasMimeType([...IMAGE_MIME, ...DOCUMENT_MIME], { each: true, message: FORMAT_IS_NOT_VALID })
  @IsFiles()
  files: MemoryStoredFile[];

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  assignmentId: number;
}
