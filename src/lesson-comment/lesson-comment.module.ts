import { Module } from '@nestjs/common';
import { LessonCommentController } from './lesson-comment.controller';
import { LessonCommentRepository } from './lesson-comment.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { CommentNotificationRepository } from '../comment-notification/comment-notification.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { LessonCommentService } from './lesson-comment.service';
import { NotificationGateway } from '../socket/notification.gateway';
import { UserRepository } from '../user/user.repository';

@Module({
  controllers: [LessonCommentController],
  providers: [
    LessonCommentService,
    LessonCommentRepository,
    LessonRepository,
    CommentNotificationRepository,
    NotificationRepository,
    UserNotificationRepository,

    NotificationGateway,
    UserRepository,
  ],
})
export class LessonCommentModule {}
