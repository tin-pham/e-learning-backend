import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { UserNotificationEntity } from './user-notification.entity';
import { UserNotificationRepository } from './user-notification.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { UserNotificationBulkDeleteDTO, UserNotificationBulkUpdateDTO } from './dto/user-notification.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class UserNotificationService extends BaseService {
  private readonly logger = new Logger(UserNotificationService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly userNotificationRepository: UserNotificationRepository,
    private readonly notificationRepository: NotificationRepository,
  ) {
    super(elasticLogger);
  }

  async readAll(decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      // Mark all as read
      await this.userNotificationRepository.updateByUserId(actorId, { isRead: true });
    } catch (error) {
      const { code, status, message } = EXCEPTION.USER_NOTIFICATION.READ_ALL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Read all user notification successfully',
      actorId,
    });
  }

  async bulkUpdate(dto: UserNotificationBulkUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkUpdate(dto, actorId);

    try {
      const userNotificationData = new UserNotificationEntity();
      userNotificationData.updatedAt = new Date();
      userNotificationData.updatedBy = actorId;
      userNotificationData.isRead = dto.isRead;

      await this.userNotificationRepository.updateByNotificationIds(dto.notificationIds, userNotificationData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.USER_NOTIFICATION.BULK_UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'User notification updated successfully',
      actorId,
    });
  }

  async bulkDelete(dto: UserNotificationBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.userNotificationRepository.deleteByNotificationIds(dto.notificationIds);
    } catch (error) {
      const { code, status, message } = EXCEPTION.USER_NOTIFICATION.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'User notification deleted successfully',
      actorId,
    });
  }

  private async validateBulkUpdate(dto: UserNotificationBulkUpdateDTO, actorId: number) {
    // Check notification ids exist
    const notificationCount = await this.notificationRepository.countByIds(dto.notificationIds);
    if (notificationCount !== dto.notificationIds.length) {
      const { code, status, message } = EXCEPTION.NOTIFICATION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(dto: UserNotificationBulkDeleteDTO, actorId: number) {
    // Check notification ids exist
    const notificationCount = await this.notificationRepository.countByIds(dto.notificationIds);
    if (notificationCount !== dto.notificationIds.length) {
      const { code, status, message } = EXCEPTION.NOTIFICATION.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
