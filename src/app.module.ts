import { MiddlewareConsumer, Module } from '@nestjs/common';
import { ConfigModule } from './config';
import { DatabaseModule, databaseConfig } from './database';
import { UserModule } from './user';
import { AuthModule } from './auth';
import { HealthModule } from './health/health.module';
import { LogsMiddleware } from './logger/logs.middleware';

@Module({
  imports: [
    ConfigModule.forRoot(),
    DatabaseModule.forRoot(databaseConfig),
    UserModule,
    AuthModule,
    HealthModule,
  ],
})
export class AppModule {
  configure(consumer: MiddlewareConsumer) {
    consumer.apply(LogsMiddleware).forRoutes('*');
  }
}
