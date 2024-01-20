import { Module } from '@nestjs/common';
import { LessonCommentController } from './lesson-comment.controller';
import { LessonCommentRepository } from './lesson-comment.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { LessonCommentService } from './lesson-comment.service';

@Module({
  controllers: [LessonCommentController],
  providers: [LessonCommentService, LessonCommentRepository, LessonRepository],
})
export class LessonCommentModule {}
