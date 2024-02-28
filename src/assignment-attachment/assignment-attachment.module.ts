import { Module } from '@nestjs/common';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';
import { AssignmentAttachmentController } from './assignment-attachment.controller';
import { S3Service } from '../s3/s3.service';
import { AssignmentAttachmentService } from './assignment-attachment.service';
import { AssignmentRepository } from '../assignment/assignment.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { AssignmentAttachmentRepository } from './assignment-attachment.repository';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [AssignmentAttachmentController],
  providers: [S3Service, AssignmentAttachmentService, AssignmentRepository, AttachmentRepository, AssignmentAttachmentRepository],
})
export class AssignmentAttachmentModule {}
