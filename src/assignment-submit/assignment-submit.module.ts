import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AssignmentSubmitController } from './assignment-submit.controller';
import { AssignmentSubmitService } from './assignment-submit.service';
import { S3Service } from '../s3/s3.service';
import { AssignmentSubmitRepository } from './assignment-submit.repository';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { StudentRepository } from '../student/student.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [AssignmentSubmitController],
  providers: [
    AssignmentSubmitService,
    AssignmentSubmitRepository,
    AssignmentRepository,
    AttachmentRepository,
    S3Service,
    StudentRepository,
    CourseStudentRepository,
  ],
})
export class AssignmentSubmitModule {}
