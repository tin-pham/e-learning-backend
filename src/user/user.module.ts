import { Module } from '@nestjs/common';
import { UserController } from './user.controller';
import { UserRepository } from './user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';
import { UserService } from './user.service';
import { S3Service } from '../s3/s3.service';

@Module({
  controllers: [UserController],
  providers: [UserService, UserRepository, UserRoleRepository, UserRoleRepository, RoleRepository, S3Service],
})
export class UserModule {}
