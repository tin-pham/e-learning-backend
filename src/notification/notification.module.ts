import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { CourseRepository } from '../course/course.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { StudentRepository } from '../student/student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { UserRepository } from '../user/user.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { CommentNotificationRepository } from '../comment-notification/comment-notification.repository';
import { LessonCommentRepository } from '../lesson-comment/lesson-comment.repository';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    CourseRepository,
    CourseStudentRepository,
    StudentRepository,
    UserNotificationRepository,
    UserRepository,
    CourseNotificationRepository,
    CommentNotificationRepository,
    LessonCommentRepository,
  ],
})
export class NotificationModule {}
