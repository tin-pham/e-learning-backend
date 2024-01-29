import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentRepository } from './assignment.repository';
import { CourseRepository } from '../course/course.repository';
import { AssignmentAttachmentRepository } from '../assignment-attachment/assignment-attachment.repository';
import { AssignmentExerciseRepository } from '../assignment-exercise/assignment-exercise.repository';
import { AssignmentService } from './assignment.service';

@Module({
  controllers: [AssignmentController],
  providers: [AssignmentService, AssignmentRepository, CourseRepository, AssignmentAttachmentRepository, AssignmentExerciseRepository],
})
export class AssignmentModule {}
