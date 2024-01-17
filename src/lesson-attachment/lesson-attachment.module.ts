import { Module } from '@nestjs/common';
import { LessonAttachmentController } from './lesson-attachment.controller';
import { LessonAttachmentRepository } from './lesson-attachment.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { LessonAttachmentService } from './lesson-attachment.service';

@Module({
  controllers: [LessonAttachmentController],
  providers: [LessonAttachmentService, LessonAttachmentRepository, LessonRepository, AttachmentRepository],
})
export class LessonAttachmentModule {}
