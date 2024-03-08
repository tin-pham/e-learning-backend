import { Module } from '@nestjs/common';
import { UserNotificationController } from './user-notification.controller';
import { UserNotificationRepository } from './user-notification.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { UserNotificationService } from './user-notification.service';

@Module({
  controllers: [UserNotificationController],
  providers: [UserNotificationService, UserNotificationRepository, NotificationRepository],
})
export class UserNotificationModule {}
