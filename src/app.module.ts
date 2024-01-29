import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { DatabaseModule, databaseConfig } from './database';
import { AuthModule } from './auth';
import { HealthModule } from './health/health.module';
import { ThrottlerModule } from './throttler/throttler.module';
import { LogsMiddleware } from './logger/logs.middleware';
import { appProviders } from './app.provider';
import { ElasticsearchLoggerModule } from './elastic-search-logger/elastic-search-logger.module';
import { S3Module } from './s3/s3.module';
import { CourseModule } from './course/course.module';
import { SectionModule } from './section/section.module';
import { QuestionModule } from './question/question.module';
import { QuestionOptionModule } from './question-option/question-option.module';
import { DifficultyModule } from './difficulty/difficulty.module';
import { ExerciseModule } from './exercise/exercise.module';
import { ExerciseQuestionModule } from './exercise-question/exercise-question.module';
import { LessonModule } from './lesson/lesson.module';
import { LessonAttachmentModule } from './lesson-attachment/lesson-attachment.module';
import { RoleModule } from './role/role.module';
import { LessonCommentModule } from './lesson-comment/lesson-comment.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { CourseStudentModule } from './course-student/course-student.module';
import { AssignmentModule } from './assignment/assignment.module';
import { CourseAssignmentModule } from './course-assignment/course-assignment.module';
import { AssignmentAttachmentModule } from './assignment-attachment/assignment-attachment.module';
import { ExerciseSubmitModule } from './exercise-submit/exercise-submit.module';
import { ExerciseSubmitMarkModule } from './exercise-submit-mark/exercise-submit-mark.module';
import { AssignmentExerciseModule } from './assignment-exercise/assignment-exercise.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(databaseConfig),
    ElasticsearchLoggerModule,
    AuthModule,
    HealthModule,
    ThrottlerModule,
    S3Module,
    RoleModule,
    // MenuModule,
    // RoleMenuModule,
    CourseModule,
    SectionModule,
    LessonModule,
    LessonAttachmentModule,
    LessonCommentModule,
    DifficultyModule,
    QuestionModule,
    QuestionOptionModule,
    ExerciseModule,
    ExerciseQuestionModule,
    StudentModule,
    TeacherModule,
    CourseStudentModule,
    AssignmentModule,
    CourseAssignmentModule,
    AssignmentAttachmentModule,
    ExerciseSubmitModule,
    ExerciseSubmitMarkModule,
    AssignmentExerciseModule,
  ],
  providers: [...appProviders],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
