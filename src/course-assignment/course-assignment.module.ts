import { Module } from '@nestjs/common';
import { CourseAssignmentController } from './course-assignment.controller';
import { CourseAssignmentRepository } from './course-assignment.repository';
import { CourseAssignmentService } from './course-assignment.service';
import { CourseRepository } from '../course/course.repository';
import { AssignmentRepository } from '../assignment/assignment.repository';

@Module({
  controllers: [CourseAssignmentController],
  providers: [CourseAssignmentService, CourseAssignmentRepository, CourseRepository, AssignmentRepository],
})
export class CourseAssignmentModule {}
