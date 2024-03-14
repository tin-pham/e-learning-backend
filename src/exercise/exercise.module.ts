import { Module } from '@nestjs/common';
import { ExerciseController } from './exercise.controller';
import { ExerciseRepository } from './exercise.repository';
import { SectionRepository } from '../section/section.repository';
import { LessonExerciseRepository } from '../lesson-exercise/lesson-exercise.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { ExerciseQuestionRepository } from '../exercise-question/exercise-question.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { ExerciseService } from './exercise.service';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';

@Module({
  controllers: [ExerciseController],
  providers: [
    ExerciseService,
    ExerciseRepository,
    SectionRepository,
    LessonExerciseRepository,
    LessonRepository,
    ExerciseQuestionRepository,
    ExerciseQuestionSnapshotRepository,
    QuestionOptionRepository,
    ExerciseQuestionOptionSnapshotRepository,
  ],
})
export class ExerciseModule {}
