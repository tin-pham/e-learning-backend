import { Module } from '@nestjs/common';
import { CourseController } from './course.controller';
import { CourseService } from './course.service';
import { S3Service } from '../s3/s3.service';
import { CourseRepository } from './course.repository';
import { SectionRepository } from '../section/section.repository';
import { CategoryRepository } from '../category/category.repository';
import { CategoryCourseRepository } from '../category-course/category-course.repository';
import { StudentRepository } from '../student/student.repository';
import { CourseAssignmentRepository } from '../course-assignment/course-assignment.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { CourseImageRepository } from '../course-image/course-image.repository';
import { ImageRepository } from '../image/image.repository';
import { LevelRepository } from '../level/level.repository';
import { TeacherRepository } from 'src/teacher/teacher.repository';

@Module({
  controllers: [CourseController],
  providers: [
    S3Service,
    CourseService,
    CourseRepository,
    SectionRepository,
    CategoryRepository,
    CategoryCourseRepository,
    StudentRepository,
    CourseAssignmentRepository,
    CourseStudentRepository,
    CourseImageRepository,
    ImageRepository,
    CourseRepository,
    LevelRepository,
    TeacherRepository,
  ],
})
export class CourseModule {}
