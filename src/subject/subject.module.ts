import { Module } from '@nestjs/common';
import { SubjectController } from './subject.controller';
import { SubjectRepository } from './subject.repository';
import { SubjectService } from './subject.service';

@Module({
  controllers: [SubjectController],
  providers: [SubjectService, SubjectRepository],
})
export class SubjectModule {}
