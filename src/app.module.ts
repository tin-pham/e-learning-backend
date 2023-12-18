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
import { ElasticSearchLoggerModule } from './elastic-search/elastic-search-logger.module';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(databaseConfig),
    AuthModule,
    HealthModule,
    ElasticSearchLoggerModule,
    ThrottlerModule,
    RoleModule,
    StudentModule,
    TeacherModule,
    ParentModule,
    SubjectModule,
    GroupModule,
  ],
  providers: [...appProviders],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
