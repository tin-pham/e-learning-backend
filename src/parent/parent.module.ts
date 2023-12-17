import { Module } from '@nestjs/common';
import { ParentController } from './parent.controller';
import { ParentService } from './parent.service';
import { ParentRepository } from './parent.repository';
import { UserRepository } from '../user/user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';

@Module({
  controllers: [ParentController],
  providers: [
    ParentService,
    ParentRepository,
    UserRepository,
    UserRoleRepository,
    RoleRepository,
  ],
})
export class ParentModule {}
