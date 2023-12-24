import { Module } from '@nestjs/common';
import { GradeController } from './grade.controller';
import { GradeRepository } from './grade.repository';
import { GradeService } from './grade.service';

@Module({
  controllers: [GradeController],
  providers: [GradeService, GradeRepository],
})
export class GradeModule {}
