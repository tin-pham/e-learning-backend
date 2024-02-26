import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { CourseRepository } from './course.repository';
import { SectionRepository } from '../section/section.repository';
import { CategoryRepository } from '../category/category.repository';
import { CategoryCourseRepository } from '../category-course/category-course.repository';
import { StudentRepository } from '../student/student.repository';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository, SectionRepository, CategoryRepository, CategoryCourseRepository, StudentRepository],
})
export class CourseModule {}
