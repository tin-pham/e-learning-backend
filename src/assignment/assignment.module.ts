import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentRepository } from './assignment.repository';
import { AssignmentExerciseRepository } from '../assignment-exercise/assignment-exercise.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { AssignmentService } from './assignment.service';
import { StudentRepository } from '../student/student.repository';
import { AssignmentSubmitRepository } from '../assignment-submit/assignment-submit.repository';

@Module({
  controllers: [AssignmentController],
  providers: [
    AssignmentService,
    AssignmentRepository,
    AssignmentExerciseRepository,
    LessonRepository,
    StudentRepository,
    AssignmentSubmitRepository,
  ],
})
export class AssignmentModule {}
