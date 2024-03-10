import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseRepository } from './exercise.repository';
import { SectionRepository } from '../section/section.repository';
import { LessonExerciseRepository } from '../lesson-exercise/lesson-exercise.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { ExerciseService } from './exercise.service';

@Module({
  controllers: [ExerciseController],
  providers: [ExerciseService, ExerciseRepository, SectionRepository, LessonExerciseRepository, LessonRepository],
})
export class ExerciseModule {}
