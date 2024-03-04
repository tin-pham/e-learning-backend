import { Module } from '@nestjs/common';
import { CategoryCourseController } from './category-course.controller';
import { CategoryCourseService } from './category-course.service';
import { CategoryCourseRepository } from './category-course.repository';
import { CategoryRepository } from '../category/category.repository';
import { CourseRepository } from '../course/course.repository';

@Module({
  controllers: [CategoryCourseController],
  providers: [CategoryCourseService, CategoryCourseRepository, CategoryRepository, CourseRepository],
})
export class CategoryCourseModule {}
