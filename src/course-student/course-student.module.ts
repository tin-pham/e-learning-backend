import { Module } from '@nestjs/common';
import { CourseStudentController } from './course-student.controller';
import { CourseStudentRepository } from './course-student.repository';
import { CourseRepository } from '../course/course.repository';
import { StudentRepository } from '../student/student.repository';
import { CourseStudentService } from './course-student.service';

@Module({
  controllers: [CourseStudentController],
  providers: [CourseStudentService, CourseStudentRepository, CourseRepository, StudentRepository],
})
export class CourseStudentModule {}
