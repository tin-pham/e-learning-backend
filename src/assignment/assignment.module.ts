import { Module } from '@nestjs/common';
import { AssignmentController } from './assignment.controller';
import { AssignmentService } from './assignment.service';
import { AssignmentRepository } from './assignment.repository';

@Module({
  controllers: [AssignmentController],
  providers: [AssignmentService, AssignmentRepository],
})
export class AssignmentModule {}
