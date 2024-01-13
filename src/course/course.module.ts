import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';
import { SectionRepository } from '../section/section.repository';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository, SectionRepository],
})
export class CourseModule {}
