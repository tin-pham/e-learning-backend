import { Module } from '@nestjs/common';
import { DirectoryController } from './directory.controller';
import { DirectoryRepository } from './directory.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { DirectoryService } from './directory.service';

@Module({
  controllers: [DirectoryController],
  providers: [DirectoryService, DirectoryRepository, AttachmentRepository],
})
export class DirectoryModule {}
