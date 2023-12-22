import { Module } from '@nestjs/common';
import { SubjectGroupController } from './subject-group.controller';
import { SubjectGroupRepository } from './subject-group.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { GroupRepository } from '../group/group.repository';
import { SubjectGroupService } from './subject-group.service';

@Module({
  controllers: [SubjectGroupController],
  providers: [
    SubjectGroupService,
    SubjectGroupRepository,
    SubjectRepository,
    GroupRepository,
  ],
})
export class SubjectGroupModule {}
