import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class AttachmentUploadRO {
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

export class AttachmentGetListDataRO {
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

export class AttachmentGetListRO extends PaginateRO<AttachmentGetListDataRO> {
  @ApiProperty({ type: [AttachmentGetListDataRO] })
  @Type(() => AttachmentGetListDataRO)
  @Expose()
  data: AttachmentGetListDataRO[];
}
