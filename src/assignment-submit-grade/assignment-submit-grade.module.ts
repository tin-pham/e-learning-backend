import { Module } from '@nestjs/common';
import { AssignmentSubmitGradeController } from './assignment-submit-grade.controller';
import { AssignmentSubmitGradeService } from './assignment-submit-grade.service';
import { AssignmentSubmitGradeRepository } from './assignment-submit-grade.repository';
import { AssignmentSubmitRepository } from '../assignment-submit/assignment-submit.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { AssignmentSubmitNotificationRepository } from '../assignment-submit-notification/assignment-submit-notification.repository';

@Module({
  controllers: [AssignmentSubmitGradeController],
  providers: [
    AssignmentSubmitGradeService,
    AssignmentSubmitGradeRepository,
    AssignmentSubmitRepository,
    NotificationRepository,
    UserNotificationRepository,
    AssignmentSubmitNotificationRepository,
  ],
})
export class AssignmentSubmitGradeModule {}
