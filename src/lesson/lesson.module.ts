import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { NotificationGateway } from '../socket/notification.gateway';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonRepository } from './lesson.repository';
import { SectionRepository } from '../section/section.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { StudentRepository } from '../student/student.repository';
import { VideoRepository } from '../video/video.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { LessonNotificationRepository } from '../lesson-notification/lesson-notification.repository';
import { UserRepository } from 'src/user/user.repository';

@Module({
  imports: [HttpModule],
  controllers: [LessonController],
  providers: [
    LessonService,
    LessonRepository,
    SectionRepository,
    CourseStudentRepository,
    StudentRepository,
    VideoRepository,
    NotificationRepository,
    CourseNotificationRepository,
    UserNotificationRepository,
    LessonNotificationRepository,

    NotificationGateway,
    UserRepository,
  ],
})
export class LessonModule {}
