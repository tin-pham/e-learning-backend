import { Module } from '@nestjs/common';
import { LessonAttachmentController } from './lesson-attachment.controller';
import { LessonAttachmentRepository } from './lesson-attachment.repository';
import { LessonAttachmentService } from './lesson-attachment.service';

@Module({
  controllers: [LessonAttachmentController],
  providers: [LessonAttachmentService, LessonAttachmentRepository],
})
export class LessonAttachmentModule {}
