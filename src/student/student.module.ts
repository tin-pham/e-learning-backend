import { Module } from '@nestjs/common';
import { StudentController } from './student.controller';
import { StudentService } from './student.service';
import { StudentRepository } from './student.repository';
import { UserRepository } from '../user/user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';
import { AttachmentRepository } from '../attachment/attachment.repository';

@Module({
  controllers: [StudentController],
  providers: [StudentService, StudentRepository, UserRepository, UserRoleRepository, RoleRepository, AttachmentRepository],
})
export class StudentModule {}
