import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonRepository } from './lesson.repository';
import { SectionRepository } from '../section/section.repository';
import { LessonService } from './lesson.service';

@Module({
  controllers: [LessonController],
  providers: [LessonService, LessonRepository, SectionRepository],
})
export class LessonModule {}
