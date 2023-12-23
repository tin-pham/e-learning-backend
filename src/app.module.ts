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

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(databaseConfig),
    ElasticsearchLoggerModule,
    AuthModule,
    HealthModule,
    ThrottlerModule,
    RoleModule,
    StudentModule,
    TeacherModule,
    ParentModule,
    StudentParentModule,
    SubjectModule,
    GroupModule,
    SubjectGroupModule,
  ],
  providers: [...appProviders],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
