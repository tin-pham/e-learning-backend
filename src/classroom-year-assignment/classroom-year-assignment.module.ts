import { Module } from '@nestjs/common';
import { ClassroomYearAssignmentController } from './classroom-year-assignment.controller';
import { ClassroomYearAssignmentService } from './classroom-year-assignment.service';
import { ClassroomYearRepository } from '../classroom-year/classroom-year.repository';
import { TeacherSubjectRepository } from '../teacher-subject/teacher-subject.repository';
import { ClassroomYearAssignmentRepository } from './classroom-year-assignment.repository';

@Module({
  controllers: [ClassroomYearAssignmentController],
  providers: [ClassroomYearAssignmentService, ClassroomYearAssignmentRepository, ClassroomYearRepository, TeacherSubjectRepository],
})
export class ClassroomYearAssignmentModule {}
