import { Module } from '@nestjs/common';
import { AssignmentExerciseController } from './assignment-exercise.controller';
import { AssignmentExerciseRepository } from './assignment-exercise.repository';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { AssignmentExerciseService } from './assignment-exercise.service';

@Module({
  controllers: [AssignmentExerciseController],
  providers: [AssignmentExerciseService, AssignmentExerciseRepository, AssignmentRepository, ExerciseRepository],
})
export class AssignmentExerciseModule {}
