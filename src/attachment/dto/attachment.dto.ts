import { ApiPropertyOptional } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber, IsOptional } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';
import { PaginateDTO } from '../../common/dto/paginate.dto';

export class AttachmentStoreDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  directoryId?: number;
}

export class AttachmentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  ids: number[];
}

export class AttachmentGetListDTO extends PaginateDTO {
  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  lessonId?: number;

  @ApiPropertyOptional()
  @IsNumber()
  @IsOptional()
  directoryId?: number;
}
