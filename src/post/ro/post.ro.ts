import { ApiProperty } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class PostStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  courseId: number;
}

export class PostGetListDataAttachmentRO {
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
}

export class PostGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  content: object;

  @ApiProperty({ type: [PostGetListDataAttachmentRO] })
  @Type(() => PostGetListDataAttachmentRO)
  @Expose()
  attachments: PostGetListDataAttachmentRO[];

  @ApiProperty()
  @Expose()
  createdByDisplayName: string;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  createdByImageUrl: string;
}

export class PostGetListRO extends PaginateRO<PostGetListDataRO> {
  @ApiProperty({ type: [PostGetListDataRO] })
  @Type(() => PostGetListDataRO)
  @Expose()
  data: PostGetListDataRO[];
}

export class PostGetDetailAttachmentRO {
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
}

export class PostGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  content: object;

  @ApiProperty({ type: [PostGetDetailAttachmentRO] })
  @Type(() => PostGetDetailAttachmentRO)
  @Expose()
  attachments: PostGetDetailAttachmentRO[];

  @ApiProperty()
  @Expose()
  createdByDisplayName: string;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  updatedAt: Date;

  @ApiProperty()
  @Expose()
  createdByImageUrl: string;
}
