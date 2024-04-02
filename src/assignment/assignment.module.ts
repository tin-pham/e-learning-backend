import { Module } from '@nestjs/common';
import { NotificationGateway } from '../socket/notification.gateway';
import { AssignmentController } from './assignment.controller';
import { AssignmentRepository } from './assignment.repository';
import { AssignmentExerciseRepository } from '../assignment-exercise/assignment-exercise.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { AssignmentService } from './assignment.service';
import { StudentRepository } from '../student/student.repository';
import { AssignmentSubmitRepository } from '../assignment-submit/assignment-submit.repository';
import { CourseRepository } from '../course/course.repository';
import { CourseAssignmentRepository } from '../course-assignment/course-assignment.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { AssignmentNotificationRepository } from '../assignment-notification/assignment-notification.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
    AssignmentRepository,
    AssignmentExerciseRepository,
    LessonRepository,
    StudentRepository,
    AssignmentSubmitRepository,
    CourseRepository,
    CourseAssignmentRepository,
    NotificationRepository,
    CourseStudentRepository,
    UserNotificationRepository,
    CourseNotificationRepository,
    AssignmentNotificationRepository,

    NotificationGateway,
    UserRepository,
  ],
})
export class AssignmentModule {}
