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

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(databaseConfig),
    AuthModule,
    HealthModule,
    ThrottlerModule,
    RoleModule,
    StudentModule,
    TeacherModule,
  ],
  providers: [...appProviders],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
