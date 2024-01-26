import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseRepository } from './exercise.repository';
import { SectionRepository } from '../section/section.repository';
import { SectionExerciseRepository } from '../section-exercise/section-exercise.repository';
import { ExerciseService } from './exercise.service';

@Module({
  controllers: [ExerciseController],
  providers: [ExerciseService, ExerciseRepository, SectionRepository, SectionExerciseRepository],
})
export class ExerciseModule {}
