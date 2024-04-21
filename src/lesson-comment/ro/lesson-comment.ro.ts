import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class LessonCommentStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  body: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  lessonId: number;

  @ApiPropertyOptional()
  @Expose()
  parentId?: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  userDisplayName: string;

  @ApiPropertyOptional()
  @Expose()
  userImageUrl?: string;

  constructor(data?: LessonCommentStoreRO) {
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
  createdAt: Date;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  lessonId: number;

  @ApiPropertyOptional()
  @Expose()
  parentId?: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  username: string;

  @ApiProperty()
  @Expose()
  userDisplayName: string;

  @ApiPropertyOptional()
  @Expose()
  userImageUrl?: string;

  @ApiProperty()
  @Expose()
  depth: number;
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
  createdAt: Date;

  @ApiProperty()
  @Expose()
  createdBy: number;

  @ApiProperty()
  @Expose()
  lessonId: number;

  @ApiPropertyOptional()
  @Expose()
  parentId?: number;

  @ApiProperty()
  @Expose()
  userId: number;

  @ApiProperty()
  @Expose()
  userDisplayName: string;

  @ApiPropertyOptional()
  @Expose()
  userImageUrl?: string;

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
