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
import { AttachmentModule } from './attachment/attachment.module';
import { LessonAttachmentModule } from './lesson-attachment/lesson-attachment.module';
import { RoleModule } from './role/role.module';
import { LessonCommentModule } from './lesson-comment/lesson-comment.module';
import { DirectoryModule } from './directory/directory.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { CourseStudentModule } from './course-student/course-student.module';

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
    // ParentModule,
    // StudentParentModule,
    // SubjectModule,
    // GroupModule,
    // SubjectGroupModule,
    // GradeModule,
    // ClassroomModule,
    // YearModule,
    // LevelModule,
    // ClassroomYearStudentModule,
    // TeacherSubjectModule,
    // ClassroomYearAssignmentModule,
    // ClassroomYearModule,
    // MenuModule,
    // RoleMenuModule,
    CourseModule,
    SectionModule,
    LessonModule,
    AttachmentModule,
    LessonAttachmentModule,
    LessonCommentModule,
    DifficultyModule,
    QuestionModule,
    QuestionOptionModule,
    ExerciseModule,
    ExerciseQuestionModule,
    DirectoryModule,
    StudentModule,
    TeacherModule,
    CourseStudentModule,
  ],
  providers: [...appProviders],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
