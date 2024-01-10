import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseRepository } from './course.repository';
import { CourseService } from './course.service';

@Module({
  controllers: [CourseController],
  providers: [CourseService, CourseRepository],
})
export class CourseModule {}
