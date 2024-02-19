import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentRepository } from './assignment.repository';
import { CourseRepository } from '../course/course.repository';
import { AssignmentExerciseRepository } from '../assignment-exercise/assignment-exercise.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { AssignmentService } from './assignment.service';

@Module({
  controllers: [AssignmentController],
  providers: [AssignmentService, AssignmentRepository, CourseRepository, AssignmentExerciseRepository, LessonRepository],
})
export class AssignmentModule {}
