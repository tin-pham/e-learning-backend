import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonRepository } from './lesson.repository';
import { SectionRepository } from '../section/section.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { StudentRepository } from '../student/student.repository';
import { VideoRepository } from '../video/video.repository';

@Module({
  imports: [HttpModule],
  controllers: [LessonController],
  providers: [LessonService, LessonRepository, SectionRepository, CourseStudentRepository, StudentRepository, VideoRepository],
})
export class LessonModule {}
