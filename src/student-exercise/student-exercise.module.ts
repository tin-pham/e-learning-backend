import { Module } from '@nestjs/common';
import { StudentExerciseController } from './student-exercise.controller';
import { StudentExerciseRepository } from './student-exercise.repository';
import { StudentExerciseService } from './student-exercise.service';
import { StudentRepository } from '../student/student.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { StudentExerciseOptionRepository } from '../student-exercise-option/student-exercise-option.repository';
import { StudentExerciseGradeRepository } from '../student-exercise-grade/student-exercise-grade.repository';

@Module({
  controllers: [StudentExerciseController],
  providers: [
    StudentExerciseService,
    StudentExerciseRepository,
    StudentRepository,
    ExerciseRepository,
    ExerciseQuestionSnapshotRepository,
    ExerciseQuestionOptionSnapshotRepository,
    StudentExerciseOptionRepository,
    StudentExerciseGradeRepository,
  ],
})
export class StudentExerciseModule {}
