import { Module } from '@nestjs/common';
import { YearController } from './year.controller';
import { YearRepository } from './year.repository';
import { SemesterRepository } from '../semester/semester.repository';
import { ClassroomYearRepository } from '../classroom-year/classroom-year.repository';
import { ClassroomRepository } from '../classroom/classroom.repository';
import { GradeRepository } from '../grade/grade.repository';
import { YearGradeRepository } from '../year-grade/year-grade.repository';
import { YearService } from './year.service';

@Module({
  controllers: [YearController],
  providers: [
    YearService,
    YearRepository,
    SemesterRepository,
    ClassroomRepository,
    ClassroomYearRepository,
    GradeRepository,
    YearGradeRepository,
  ],
})
export class YearModule {}
