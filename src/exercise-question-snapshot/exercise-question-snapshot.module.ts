import { Module } from '@nestjs/common';
import { ExerciseQuestionSnapshotController } from './exercise-question-snapshot.controller';
import { ExerciseQuestionSnapshotService } from './exercise-question-snapshot.service';
import { ExerciseQuestionSnapshotRepository } from './exercise-question-snapshot.repository';
import { StudentExerciseGradeRepository } from '../student-exercise-grade/student-exercise-grade.repository';
import { StudentExerciseRepository } from '../student-exercise/student-exercise.repository';

@Module({
  controllers: [ExerciseQuestionSnapshotController],
  providers: [
    ExerciseQuestionSnapshotService,
    ExerciseQuestionSnapshotRepository,
    StudentExerciseGradeRepository,
    StudentExerciseRepository,
  ],
})
export class ExerciseQuestionSnapshotModule {}
