import { Module } from '@nestjs/common';
import { StudentParentController } from './student-parent.controller';
import { StudentParentService } from './student-parent.service';
import { StudentParentRepository } from './student-parent.repository';
import { StudentRepository } from '../student/student.repository';
import { ParentRepository } from '../parent/parent.repository';

@Module({
  controllers: [StudentParentController],
  providers: [
    StudentParentService,
    StudentParentRepository,
    StudentRepository,
    ParentRepository,
  ],
})
export class StudentParentModule {}
