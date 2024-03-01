import { Module } from '@nestjs/common';
import { AssignmentSubmitGradeController } from './assignment-submit-grade.controller';
import { AssignmentSubmitGradeService } from './assignment-submit-grade.service';
import { AssignmentSubmitGradeRepository } from './assignment-submit-grade.repository';
import { AssignmentSubmitRepository } from '../assignment-submit/assignment-submit.repository';

@Module({
  controllers: [AssignmentSubmitGradeController],
  providers: [AssignmentSubmitGradeService, AssignmentSubmitGradeRepository, AssignmentSubmitRepository],
})
export class AssignmentSubmitGradeModule {}
