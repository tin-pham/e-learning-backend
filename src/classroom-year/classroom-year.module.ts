import { Module } from '@nestjs/common';
import { ClassroomYearController } from './classroom-year.controller';
import { ClassroomYearService } from './classroom-year.service';
import { ClassroomYearRepository } from './classroom-year.repository';

@Module({
  controllers: [ClassroomYearController],
  providers: [ClassroomYearService, ClassroomYearRepository],
})
export class ClassroomYearModule {}
