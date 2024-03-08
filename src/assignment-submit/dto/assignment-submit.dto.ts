import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Transform, Type } from 'class-transformer';
import { UNPROCESSABLE_ENTITY_EXCEPTION } from '../../common';
import { DOCUMENT_MIME } from '../../common/constant/mime-type.constant';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { IsBoolean, IsNumber, IsOptional } from 'class-validator';
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

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  isLate?: boolean;

  @ApiPropertyOptional({ example: false })
  @IsBoolean()
  @Transform(({ value }) => {
    if (value === 'true') return true;
    if (value === 'false') return false;
    return value;
  })
  @IsOptional()
  isCorrect?: boolean;
}

export class AssignmentSubmitDeleteDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  id: number;
}

export class AssignmentSubmitGetStatisticDTO {
  @ApiProperty({ example: 1 })
  @IsNumber()
  @Type(() => Number)
  assignmentId: number;
}
