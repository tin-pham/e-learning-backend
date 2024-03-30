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
import { NotificationRepository } from '../notification/notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { ExerciseNotificationRepository } from '../exercise-notification/exercise-notification.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { StudentRepository } from '../student/student.repository';

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
    NotificationRepository,
    UserNotificationRepository,
    CourseNotificationRepository,
    ExerciseNotificationRepository,
    CourseStudentRepository,
    StudentRepository,
  ],
})
export class ExerciseModule {}
