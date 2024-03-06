import { Module } from '@nestjs/common';
import { NotificationController } from './notification.controller';
import { NotificationService } from './notification.service';
import { NotificationRepository } from './notification.repository';
import { CourseRepository } from '../course/course.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { StudentRepository } from '../student/student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';

@Module({
  controllers: [NotificationController],
  providers: [
    NotificationService,
    NotificationRepository,
    CourseRepository,
    CourseStudentRepository,
    StudentRepository,
    UserNotificationRepository,
  ],
})
export class NotificationModule {}
