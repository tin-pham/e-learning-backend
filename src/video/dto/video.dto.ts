import { ApiProperty } from '@nestjs/swagger';
import { ArrayMinSize, IsArray, IsNumber } from 'class-validator';
import { ApiArrayProperty, SwaggerQueryParamStyle } from '../../common/decorator';
import { PaginateDTO } from '../../common/dto/paginate.dto';
import { FileSystemStoredFile, HasMimeType, IsFile } from 'nestjs-form-data';

export class VideoUploadDTO {
  @ApiProperty({ type: 'string', format: 'binary' })
  @HasMimeType(['video/mp4'])
  @IsFile()
  video: FileSystemStoredFile;
}

export class VideoBulkDeleteDTO {
  @ApiArrayProperty(SwaggerQueryParamStyle.CSV)
  @IsNumber({}, { each: true })
  @ArrayMinSize(1)
  @IsArray()
  ids: number[];
}

export class VideoGetListDTO extends PaginateDTO {}
