import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { FileSystemStoredFile, IsFile } from 'nestjs-form-data';

export class AttachmentUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  @IsFile()
  video: FileSystemStoredFile;
}

export class AttachmentBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  ids: number[];
}

export class AttachmentGetListDTO extends PaginateDTO {}
