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
  commentOwnerUsername?: string;

  @ApiPropertyOptional()
  @Expose()
  commentOwnerImageUrl?: string;

  @ApiPropertyOptional()
  @Expose()
  studentExerciseNotificationId?: number;

  @ApiPropertyOptional()
  @Expose()
  exerciseSubmitId?: number;

  @ApiPropertyOptional()
  @Expose()
  assignmentSubmitNotificationId?: number;

  @ApiPropertyOptional()
  @Expose()
  assignmentSubmitAssignmentId: number;

  @ApiPropertyOptional()
  @Expose()
  assignmentSubmitAssignmentName: number;


  @ApiPropertyOptional()
  @Expose()
  assignmentId: number;

  @ApiPropertyOptional()
  @Expose()
  assignmentName: string;

  @ApiPropertyOptional()
  @Expose()
  lessonId: number;

  @ApiPropertyOptional()
  @Expose()
  sectionId: number;

  @ApiPropertyOptional()
  @Expose()
  assignmentNotificationId: number;

  @ApiPropertyOptional()
  @Expose()
  exerciseId: number;

  @ApiPropertyOptional()
  @Expose()
  exerciseName: string;

  @ApiPropertyOptional()
  @Expose()
  postNotificationId: number;

  @ApiPropertyOptional()
  @Expose()
  postId: number;
}

export class NotificationGetListRO extends PaginateRO<NotificationGetListDataRO> {
  @ApiProperty({ type: [NotificationGetListDataRO] })
  @Type(() => NotificationGetListDataRO)
  @Expose()
  data: NotificationGetListDataRO[];
}
