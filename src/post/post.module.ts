import { Module } from '@nestjs/common';
import { PostController } from './post.controller';
import { PostService } from './post.service';
import { PostRepository } from './post.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { StudentRepository } from '../student/student.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { PostNotificationRepository } from '../post-notification/post-notification.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { CourseRepository } from '../course/course.repository';

@Module({
  controllers: [PostController],
  providers: [
    PostService,
    PostRepository,
    NotificationRepository,
    UserNotificationRepository,
    StudentRepository,
    CourseStudentRepository,
    PostNotificationRepository,
    CourseNotificationRepository,
    CourseRepository,
  ],
})
export class PostModule {}
