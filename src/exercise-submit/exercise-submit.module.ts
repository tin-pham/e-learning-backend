import { Module } from '@nestjs/common';
import { ExerciseSubmitController } from './exercise-submit.controller';
import { ExerciseSubmitRepository } from './exercise-submit.repository';
import { StudentRepository } from '../student/student.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { ExerciseSubmitService } from './exercise-submit.service';

@Module({
  controllers: [ExerciseSubmitController],
  providers: [ExerciseSubmitRepository, ExerciseSubmitService, StudentRepository, ExerciseRepository],
})
export class ExerciseSubmitModule {}
