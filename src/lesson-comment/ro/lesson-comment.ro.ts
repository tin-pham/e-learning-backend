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
  userId: number;

  @ApiPropertyOptional()
  @Expose()
  parentId?: number;

  constructor(data?: Partial<LessonCommentStoreRO>) {
    Object.assign(this, data);
  }
}

export class LessonCommentGetListDataRO {
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
  userId: number;

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
  userId: number;

  @ApiPropertyOptional()
  @Expose()
  parentId?: number;

  constructor(data?: Partial<LessonCommentGetDetailRO>) {
    Object.assign(this, data);
  }
}
