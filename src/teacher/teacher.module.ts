import { Module } from '@nestjs/common';
import { TeacherController } from './teacher.controller';
import { TeacherService } from './teacher.service';
import { TeacherRepository } from './teacher.repository';
import { UserRepository } from '../user/user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';
import { AttachmentRepository } from 'src/attachment/attachment.repository';

@Module({
  controllers: [TeacherController],
  providers: [TeacherService, TeacherRepository, UserRepository, UserRoleRepository, RoleRepository, AttachmentRepository],
})
export class TeacherModule {}
