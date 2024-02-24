import { Module } from '@nestjs/common';
import { LessonController } from './lesson.controller';
import { LessonService } from './lesson.service';
import { LessonRepository } from './lesson.repository';
import { SectionRepository } from '../section/section.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { StudentRepository } from '../student/student.repository';

@Module({
  controllers: [LessonController],
  providers: [LessonService, LessonRepository, SectionRepository, CourseStudentRepository, StudentRepository],
})
export class LessonModule {}
