import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class LessonAttachmentGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;

  @ApiProperty()
  @Expose()
  name: string;

  @ApiProperty()
  @Expose()
  type: string;

  @ApiProperty()
  @Expose()
  size: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}

export class LessonAttachmentGetListRO extends PaginateRO<LessonAttachmentGetListDataRO> {
  @ApiProperty({ type: [LessonAttachmentGetListDataRO] })
  @Type(() => LessonAttachmentGetListDataRO)
  @Expose()
  data: LessonAttachmentGetListDataRO[];
}
