import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';
import { SectionRepository } from '../section/section.repository';
import { CategoryRepository } from '../category/category.repository';
import { CategoryCourseRepository } from '../category-course/category-course.repository';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository, SectionRepository, CategoryRepository, CategoryCourseRepository],
})
export class CourseModule {}
