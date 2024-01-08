import { Module } from '@nestjs/common';
import { ClassroomYearStudentController } from './classroom-year-student.controller';
import { ClassroomYearStudentService } from './classroom-year-student.service';
import { ClassroomYearStudentRepository } from './classroom-year-student.repository';
import { ClassroomYearRepository } from '../classroom-year/classroom-year.repository';
import { StudentRepository } from '../student/student.repository';

@Module({
  controllers: [ClassroomYearStudentController],
  providers: [ClassroomYearStudentService, ClassroomYearStudentRepository, ClassroomYearRepository, StudentRepository],
})
export class ClassroomYearStudentModule {}
