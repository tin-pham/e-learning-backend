import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseRepository } from './course.repository';
import { SectionRepository } from '../section/section.repository';
import { CategoryRepository } from '../category/category.repository';
import { CategoryCourseRepository } from '../category-course/category-course.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository, SectionRepository, CategoryRepository, CategoryCourseRepository, AttachmentRepository],
})
export class CourseModule {}
