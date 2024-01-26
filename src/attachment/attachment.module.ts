import { Module } from '@nestjs/common';
import { AttachmentController } from './attachment.controller';
import { AttachmentRepository } from './attachment.repository';
import { DirectoryRepository } from '../directory/directory.repository';
import { AttachmentService } from './attachment.service';

@Module({
  controllers: [AttachmentController],
  providers: [AttachmentService, AttachmentRepository, DirectoryRepository],
})
export class AttachmentModule {}
