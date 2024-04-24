import { Module } from '@nestjs/common';
import { ExerciseQuestionController } from './exercise-question.controller';
import { ExerciseQuestionService } from './exercise-question.service';
import { ExerciseQuestionRepository } from './exercise-question.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { QuestionRepository } from '../question/question.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { StudentExerciseOptionRepository } from '../student-exercise-option/student-exercise-option.repository';
import { StudentExerciseRepository } from '../student-exercise/student-exercise.repository';

@Module({
  controllers: [ExerciseQuestionController],
  providers: [
    ExerciseQuestionService,
    ExerciseQuestionRepository,
    ExerciseRepository,
    QuestionRepository,
    ExerciseQuestionSnapshotRepository,
    ExerciseQuestionOptionSnapshotRepository,
    StudentExerciseOptionRepository,
    StudentExerciseRepository,
  ],
})
export class ExerciseQuestionModule {}
