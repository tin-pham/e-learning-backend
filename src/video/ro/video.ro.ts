import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class VideoUploadRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  path: string;

  @ApiProperty()
  @Expose()
  mimeType: string;
}

export class VideoGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
}

export class VideoGetListRO extends PaginateRO<VideoGetListDataRO> {
  @ApiProperty({ type: [VideoGetListDataRO] })
  @Type(() => VideoGetListDataRO)
  @Expose()
  data: VideoGetListDataRO[];
}
