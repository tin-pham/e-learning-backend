import { Module } from '@nestjs/common';
import { LevelController } from './level.controller';
import { GradeRepository } from '../grade/grade.repository';
import { ClassroomRepository } from '../classroom/classroom.repository';
import { LevelService } from './level.service';

@Module({
  controllers: [LevelController],
  providers: [LevelService, GradeRepository, ClassroomRepository],
})
export class LevelModule {}
