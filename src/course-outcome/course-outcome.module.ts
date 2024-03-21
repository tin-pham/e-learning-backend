import { Module } from '@nestjs/common';
import { CourseOutcomeController } from './course-outcome.controller';
import { CourseOutcomeService } from './course-outcome.service';
import { CourseOutcomeRepository } from './course-outcome.repository';
import { CourseRepository } from '../course/course.repository';

@Module({
  controllers: [CourseOutcomeController],
  providers: [CourseOutcomeService, CourseOutcomeRepository, CourseRepository],
})
export class CourseOutcomeModule {}
