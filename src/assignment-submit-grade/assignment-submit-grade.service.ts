import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { AssignmentSubmitGradeEntity } from './assignment-submit-grade.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { AssignmentSubmitNotificationEntity } from '../assignment-submit-notification/assignment-submit-notification.entity';
import { UserNotificationEntity } from '../user-notification/user-notification.entity';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AssignmentSubmitRepository } from '../assignment-submit/assignment-submit.repository';
import { AssignmentSubmitGradeRepository } from './assignment-submit-grade.repository';
import { AssignmentSubmitNotificationRepository } from '../assignment-submit-notification/assignment-submit-notification.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { AssignmentSubmitGradeStoreDTO } from './dto/assignment-submit-grade.dto';
import { AssignmentSubmitGradeStoreRO } from './ro/assignment-submit-grade.ro';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class AssignmentSubmitGradeService extends BaseService {
  private readonly logger = new Logger(AssignmentSubmitGradeService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly assignmentSubmitRepository: AssignmentSubmitRepository,
    private readonly assignmentSubmitGradeRepository: AssignmentSubmitGradeRepository,
    private readonly assignmentSubmitNotificationRepository: AssignmentSubmitNotificationRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: AssignmentSubmitGradeStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { assignmentSubmit } = await this.validateStore(dto, actorId);

    const response = new AssignmentSubmitGradeStoreRO();

    try {
      const assignmentSubmitGradeData = new AssignmentSubmitGradeEntity({
        assignmentSubmitId: dto.assignmentSubmitId,
        message: dto.message,
        grade: dto.grade,
        createdBy: actorId,
      });

      await this.database.transaction().execute(async (transaction) => {
        // Store grade
        const assignmentSubmitGrade = await this.assignmentSubmitGradeRepository.insertWithTransaction(
          transaction,
          assignmentSubmitGradeData,
        );

        // // Store notification
        const notificationData = new NotificationEntity({
          title: 'ĐÃ CHẤM ĐIỂM',
          content: `Assignment ${assignmentSubmit.assignmentName} đã được chấm điểm`,
        });
        const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

        const assignmentSubmitNotificationData = new AssignmentSubmitNotificationEntity({
          assignmentSubmitId: assignmentSubmit.id,
          notificationId: notification.id,
        });
        await this.assignmentSubmitNotificationRepository.insertWithTransaction(transaction, assignmentSubmitNotificationData);

        // Notify student exercise
        const userNotificationData = new UserNotificationEntity({
          userId: assignmentSubmit.createdBy,
          notificationId: notification.id,
        });

        await this.userNotificationRepository.insertWithTransaction(transaction, userNotificationData);

        response.id = assignmentSubmitGrade.id;
        response.grade = assignmentSubmitGrade.grade;
        response.message = assignmentSubmitGrade.message;
        response.assignmentSubmitId = assignmentSubmitGrade.assignmentSubmitId;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT_GRADE.STORE_FAILED;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentSubmitGradeStoreRO,
      response,
      message: 'Store assignment submit grade successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      await this.assignmentSubmitGradeRepository.delete(id, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT_GRADE.DELETE_FAILED;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Delete assignment submit grade successfully',
      actorId,
    });
  }

  private async validateStore(dto: AssignmentSubmitGradeStoreDTO, actorId: number) {
    // Check assignment submit exist
    const assignmentSubmit = await this.assignmentSubmitRepository.getAssignmentNameById(dto.assignmentSubmitId);
    if (!assignmentSubmit) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT.DOES_NOT_EXIST;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }

    // Check exist
    const assignmentSubmitGradeCount = await this.assignmentSubmitGradeRepository.countByAssignmentSubmitId(dto.assignmentSubmitId);
    if (assignmentSubmitGradeCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT_GRADE.ALREADY_EXIST;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }

    // Get assignmentName

    return { assignmentSubmit };
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const assignmentSubmitGradeCount = await this.assignmentSubmitGradeRepository.countById(id);
    if (!assignmentSubmitGradeCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT_SUBMIT_GRADE.DOES_NOT_EXIST;
      this.logger.error({ actorId, code, status, message });
      this.throwException({ code, status, message, actorId });
    }
  }
}
