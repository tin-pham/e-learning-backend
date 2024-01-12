import { Module } from '@nestjs/common';
import { LessonFileController } from './lesson-file.controller';
import { LessonFileService } from './lesson-file.service';
import { LessonFileRepository } from './lesson-file.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { FileRepository } from '../file/file.repository';

@Module({
  controllers: [LessonFileController],
  providers: [LessonFileService, LessonFileRepository, LessonRepository, FileRepository],
})
export class LessonFileModule {}
