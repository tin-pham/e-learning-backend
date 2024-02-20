import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';
import { RoleRepository } from '../role/role.repository';
import { UserService } from './user.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserRoleRepository, UserRoleRepository, AttachmentRepository, RoleRepository],
})
export class UserModule {}
