import { Module } from '@nestjs/common';
import { ClassroomYearController } from './classroom-year.controller';
import { ClassroomYearService } from './classroom-year.service';
import { ClassroomYearRepository } from './classroom-year.repository';
import { TeacherRepository } from '../teacher/teacher.repository';

@Module({
  controllers: [ClassroomYearController],
  providers: [ClassroomYearService, ClassroomYearRepository, TeacherRepository],
})
export class ClassroomYearModule {}
