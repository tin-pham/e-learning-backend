import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { S3Service } from '../s3/s3.service';
import { TeacherRepository } from './teacher.repository';
import { UserRepository } from '../user/user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository, UserRepository, UserRoleRepository, RoleRepository, S3Service],
})
export class TeacherModule {}
