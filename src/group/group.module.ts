import { Module } from '@nestjs/common';
import { GroupController } from './group.controller';
import { GroupRepository } from './group.repository';
import { GroupService } from './group.service';

@Module({
  controllers: [GroupController],
  providers: [GroupService, GroupRepository],
})
export class GroupModule {}
