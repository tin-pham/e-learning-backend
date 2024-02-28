import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentRepository } from './attachment.repository';
import { AttachmentService } from './attachment.service';
import { S3Service } from '../s3/s3.service';

@Module({
  controllers: [AttachmentController],
  providers: [AttachmentService, AttachmentRepository, S3Service],
})
export class AttachmentModule {}
