import { Module } from '@nestjs/common';
import { LessonVideoController } from './lesson-video.controller';
import { LessonVideoRepository } from './lesson-video.repository';
import { LessonVideoService } from './lesson-video.service';
import { LessonRepository } from '../lesson/lesson.repository';
import { VideoRepository } from '../video/video.repository';

@Module({
  controllers: [LessonVideoController],
  providers: [LessonVideoService, LessonVideoRepository, LessonRepository, VideoRepository],
})
export class LessonVideoModule {}
