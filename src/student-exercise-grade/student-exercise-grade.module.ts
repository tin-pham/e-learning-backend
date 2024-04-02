import { Module } from '@nestjs/common';
import { NotificationGateway } from '../socket/notification.gateway';
import { StudentExerciseRepository } from '../student-exercise/student-exercise.repository';
import { StudentExerciseGradeRepository } from './student-exercise-grade.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { StudentExerciseOptionRepository } from '../student-exercise-option/student-exercise-option.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { StudentExerciseGradeController } from './student-exercise-grade.controller';
import { StudentExerciseGradeService } from './student-exercise-grade.service';
import { StudentRepository } from '../student/student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { StudentExerciseNotificationRepository } from '../student-exercise-notification/student-exercise-notification.repository';
import { UserRepository } from '../user/user.repository';

@Module({
  controllers: [StudentExerciseGradeController],
  providers: [
    StudentExerciseGradeService,
    StudentExerciseRepository,
    StudentExerciseGradeRepository,
    ExerciseQuestionSnapshotRepository,
    ExerciseQuestionOptionSnapshotRepository,
    StudentExerciseOptionRepository,
    ExerciseRepository,
    StudentRepository,
    UserNotificationRepository,
    NotificationRepository,
    StudentExerciseNotificationRepository,

    NotificationGateway,
    UserRepository,
  ],
})
export class StudentExerciseGradeModule {}
