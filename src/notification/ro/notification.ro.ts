import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Expose, Type } from 'class-transformer';
import { PaginateRO } from '../../common/ro/paginate.ro';

export class NotificationStoreRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;
}

export class NotificationGetListDataRO {
  @ApiProperty()
  @Expose()
  id: number;

  @ApiProperty()
  @Expose()
  title: string;

  @ApiProperty()
  @Expose()
  content: string;

  @ApiProperty()
  @Expose()
  createdAt: Date;

  @ApiPropertyOptional()
  @Expose()
  courseId?: number;

  @ApiPropertyOptional()
  @Expose()
  courseName?: string;

  @ApiPropertyOptional()
  @Expose()
  assignmentId?: number;

  @ApiPropertyOptional()
  @Expose()
  isRead?: boolean;

  @ApiPropertyOptional()
  @Expose()
  commentId?: number;

  @ApiPropertyOptional()
  @Expose()
  commentParentId?: number;

  @ApiPropertyOptional()
  @Expose()
  commentOwnerId?: number;

  @ApiPropertyOptional()
  @Expose()
  commentOwnerDisplayName?: string;

  @ApiPropertyOptional()
  @Expose()
  commentOwnerImageUrl?: string;

  @ApiPropertyOptional()
  @Expose()
  studentExerciseNotificationId?: number;

  @ApiPropertyOptional()
  @Expose()
  exerciseId: number;
}

export class NotificationGetListRO extends PaginateRO<NotificationGetListDataRO> {
  @ApiProperty({ type: [NotificationGetListDataRO] })
  @Type(() => NotificationGetListDataRO)
  @Expose()
  data: NotificationGetListDataRO[];
}
