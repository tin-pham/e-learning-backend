import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { DOCUMENT_MIME } from '../../common/constant/mime-type.constant';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { IsNumber, IsOptional } from 'class-validator';
import { HasMimeType, IsFile, MaxFileSize, MemoryStoredFile } from 'nestjs-form-data';

const { FORMAT_IS_NOT_VALID } = UNPROCESSABLE_ENTITY_EXCEPTION.MIME;

export class AssignmentSubmitStoreDTO {
  @ApiProperty({ type: String, format: 'binary' })
  @MaxFileSize(3 * 1024 * 1024)
  @HasMimeType(DOCUMENT_MIME, { message: FORMAT_IS_NOT_VALID })
  @IsFile()
  file: MemoryStoredFile;

  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  assignmentId: number;
}

export class AssignmentSubmitGetListDTO extends PaginateDTO {
  @ApiPropertyOptional({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  assignmentId?: number;
}

export class AssignmentSubmitDeleteDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  id: number;
}
