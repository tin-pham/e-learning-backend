import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserService } from './user.service';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, RoleRepository, UserRoleRepository],
})
export class UserModule {}
