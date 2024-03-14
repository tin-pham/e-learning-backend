import { Module } from '@nestjs/common';
import { StudentExerciseRepository } from '../student-exercise/student-exercise.repository';
import { StudentExerciseGradeRepository } from './student-exercise-grade.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { StudentExerciseOptionRepository } from '../student-exercise-option/student-exercise-option.repository';
import { StudentExerciseGradeController } from './student-exercise-grade.controller';
import { StudentExerciseGradeService } from './student-exercise-grade.service';

@Module({
  controllers: [StudentExerciseGradeController],
  providers: [
    StudentExerciseGradeService,
    StudentExerciseRepository,
    StudentExerciseGradeRepository,
    ExerciseQuestionSnapshotRepository,
    ExerciseQuestionOptionSnapshotRepository,
    StudentExerciseOptionRepository,
  ],
})
export class StudentExerciseGradeModule {}
