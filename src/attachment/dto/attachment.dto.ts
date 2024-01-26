import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { ArrayMinSize, IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class AttachmentUploadDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  directoryId?: number;
}

export class AttachmentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV, [Number], (value) => Number.parseInt(value))
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  ids: number[];
}

export class AttachmentGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  lessonId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @Type(() => Number)
  @IsOptional()
  directoryId?: number;
}
