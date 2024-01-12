import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { DatabaseModule, databaseConfig } from './database';
import { AuthModule } from './auth';
import { HealthModule } from './health/health.module';
import { ThrottlerModule } from './throttler/throttler.module';
import { LogsMiddleware } from './logger/logs.middleware';
import { appProviders } from './app.provider';
import { RoleModule } from './role/role.module';
import { StudentModule } from './student/student.module';
import { TeacherModule } from './teacher/teacher.module';
import { ParentModule } from './parent/parent.module';
import { SubjectModule } from './subject/subject.module';
import { GroupModule } from './group/group.module';
import { ElasticsearchLoggerModule } from './elastic-search-logger/elastic-search-logger.module';
import { SubjectGroupModule } from './subject-group/subject-group.module';
import { StudentParentModule } from './student-parent/student-parent.module';
import { GradeModule } from './grade/grade.module';
import { ClassroomModule } from './classroom/classroom.module';
import { YearModule } from './year/year.module';
import { LevelModule } from './level/level.module';
import { ClassroomYearStudentModule } from './classroom-year-student/classroom-year-student.module';
import { TeacherSubjectModule } from './teacher-subject/teacher-subject.module';
import { ClassroomYearAssignmentModule } from './classroom-year-assignment/classroom-year-assignment.module';
import { ClassroomYearModule } from './classroom-year/classroom-year.module';
import { S3Module } from './s3/s3.module';
import { MenuModule } from './menu/menu.module';
import { RoleMenuModule } from './role-menu/role-menu.module';
import { CourseModule } from './course/course.module';
import { SectionModule } from './section/section.module';
import { AnswerModule } from './answer/answer.module';
import { QuestionModule } from './question/question.module';
import { QuestionOptionModule } from './question-option/question-option.module';
import { FileModule } from './file/file.module';
import { LessonFileModule } from './lesson-file/lesson-file.module';
import { VideoModule } from './video/video.module';
import { LessonVideoModule } from './lesson-video/lesson-video.module';

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
    StudentModule,
    TeacherModule,
    ParentModule,
    StudentParentModule,
    SubjectModule,
    GroupModule,
    SubjectGroupModule,
    GradeModule,
    ClassroomModule,
    YearModule,
    LevelModule,
    ClassroomYearStudentModule,
    TeacherSubjectModule,
    ClassroomYearAssignmentModule,
    ClassroomYearModule,
    MenuModule,
    RoleMenuModule,
    CourseModule,
    SectionModule,
    AnswerModule,
    QuestionModule,
    QuestionOptionModule,
    FileModule,
    LessonFileModule,
    VideoModule,
    LessonVideoModule,
  ],
  providers: [...appProviders],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
