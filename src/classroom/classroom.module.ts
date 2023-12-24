import { Module } from '@nestjs/common';
import { ClassroomRepository } from './classroom.repository';
import { ClassroomService } from './classroom.service';
import { ClassroomController } from './classroom.controller';
import { GradeRepository } from '../grade/grade.repository';

@Module({
  controllers: [ClassroomController],
  providers: [ClassroomService, ClassroomRepository, GradeRepository],
})
export class ClassroomModule {}
