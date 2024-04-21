import { Module } from '@nestjs/common';
import { LessonAttachmentController } from './lesson-attachment.controller';
import { LessonAttachmentRepository } from './lesson-attachment.repository';
import { LessonAttachmentService } from './lesson-attachment.service';
import { S3Service } from '../s3/s3.service';
import { MemoryStoredFile, NestjsFormDataModule } from 'nestjs-form-data';

@Module({
  imports: [NestjsFormDataModule.config({ storage: MemoryStoredFile })],
  controllers: [LessonAttachmentController],
  providers: [LessonAttachmentService, LessonAttachmentRepository, S3Service],
})
export class LessonAttachmentModule {}
