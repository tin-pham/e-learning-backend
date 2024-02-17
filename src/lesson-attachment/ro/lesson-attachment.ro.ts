import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';

export class LessonAttachmentGetListDataRO {
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
}

export class LessonAttachmentGetListRO {
  @ApiProperty({ type: [LessonAttachmentGetListDataRO] })
  @Type(() => LessonAttachmentGetListDataRO)
  @Expose()
  data: LessonAttachmentGetListDataRO[];
}
