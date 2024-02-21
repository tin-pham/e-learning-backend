import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from 'src/common/ro/paginate.ro';

export class LessonCommentStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  lessonId: number;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiPropertyOptional()
  @Expose()
  parentId?: number;

  constructor(data?: LessonCommentStoreRO) {
    Object.assign(this, data);
  }
}

export class LessonCommentGetListDataCreatedByImageRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  url: string;
}

export class LessonCommentGetListDataCreatedByRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  displayName: string;

  @ApiProperty({ type: LessonCommentGetListDataCreatedByImageRO })
  @Type(() => LessonCommentGetListDataCreatedByImageRO)
  @Expose()
  image: LessonCommentGetListDataCreatedByImageRO;
}

export class LessonCommentGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty({ type: LessonCommentGetListDataCreatedByRO })
  @Type(() => LessonCommentGetListDataCreatedByRO)
  @Expose()
  createdByUser: LessonCommentGetListDataCreatedByRO;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional()
  @Expose()
  parentId?: number;
}

export class LessonCommentGetListRO extends PaginateRO<LessonCommentGetListDataRO> {
  @ApiProperty({ type: [LessonCommentGetListDataRO] })
  @Type(() => LessonCommentGetListDataRO)
  @Expose()
  override data: LessonCommentGetListDataRO[];
}

export class LessonCommentGetDetailRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  lessonId: number;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  parentId: number;

  constructor(data?: LessonCommentGetDetailRO) {
    Object.assign(this, data);
  }
}

export class LessonCommentUpdateRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  body: string;

  constructor(data?: Partial<LessonCommentUpdateRO>) {
    Object.assign(this, data);
  }
}

export class LessonCommentDeleteRO {
  @ApiProperty()
  @Expose()
  id: number;

  constructor(data?: Partial<LessonCommentDeleteRO>) {
    Object.assign(this, data);
  }
}
