import { Module } from '@nestjs/common';
import { TeacherSubjectController } from './teacher-subject.controller';
import { TeacherSubjectRepository } from './teacher-subject.repository';
import { TeacherSubjectService } from './teacher-subject.service';
import { TeacherRepository } from '../teacher/teacher.repository';
import { SubjectRepository } from '../subject/subject.repository';

@Module({
  controllers: [TeacherSubjectController],
  providers: [TeacherSubjectService, TeacherSubjectRepository, TeacherRepository, SubjectRepository],
})
export class TeacherSubjectModule {}
