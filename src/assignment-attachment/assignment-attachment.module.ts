import { Module } from '@nestjs/common';
import { AssignmentAttachmentController } from './assignment-attachment.controller';
import { AssignmentAttachmentRepository } from './assignment-attachment.repository';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { AssignmentAttachmentService } from './assignment-attachment.service';

@Module({
  controllers: [AssignmentAttachmentController],
  providers: [AssignmentAttachmentService, AssignmentAttachmentRepository, AssignmentRepository],
})
export class AssignmentAttachmentModule {}
