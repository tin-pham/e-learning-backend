import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { NotificationGateway } from '../socket/notification.gateway';
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
import { PostAttachmentRepository } from '../post-attachment/post-attachment.repository';
import { S3Service } from '../s3/s3.service';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [PostController],
  providers: [
    S3Service,
    PostService,
    PostRepository,
    NotificationRepository,
    UserNotificationRepository,
    StudentRepository,
    CourseStudentRepository,
    PostNotificationRepository,
    CourseNotificationRepository,
    CourseRepository,
    PostAttachmentRepository,
    AttachmentRepository,

    NotificationGateway,
    UserRepository,
  ],
})
export class PostModule {}
