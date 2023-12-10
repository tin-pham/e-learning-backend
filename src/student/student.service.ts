import { Injectable } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';
import { StudentEntity } from './student.entity';
import { StudentRepository } from './student.repository';
import { UserRepository } from 'src/user/user.repository';
import { RoleRepository } from 'src/role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserService } from '../user/user.service';
import { StudentStoreDTO } from './dto/student.dto';
import { StudentGetListRO, StudentStoreRO } from './ro/student.ro';
import { UserGetListDTO } from '../user/dto/user.dto';

@Injectable()
export class StudentService extends UserService {
  constructor(
    userRepository: UserRepository,
    roleRepository: RoleRepository,
    userRoleRepository: UserRoleRepository,
    private readonly database: DatabaseService,
    private readonly studentRepository: StudentRepository,
  ) {
    super(userRepository, roleRepository, userRoleRepository);
  }

  async store(dto: StudentStoreDTO, decoded: IJwtPayload) {
    await this.validateStore(dto);
    const response = new StudentStoreRO();
    console.log(decoded);
    await this.database.transaction().execute(async (transaction) => {
      // Store user
      const user = await super.storeUserWithTransaction(
        transaction,
        dto,
        decoded.userId,
      );

      // Get student role id
      const { id: roleId } = await this.roleRepository.getIdByName(
        USER_ROLE.STUDENT,
      );

      // Store user role
      await super.storeUserRoleWithTransaction(transaction, user.id, roleId);

      // Store student
      const studentData = new StudentEntity();
      studentData.userId = user.id;
      await this.studentRepository.storeWithTransaction(
        transaction,
        studentData,
      );

      // Set response
      response.username = user.username;
      response.email = user.email;
      response.phone = user.phone;
      response.displayName = user.displayName;
    });

    return plainToInstance(StudentStoreRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async getList(dto: UserGetListDTO) {
    const data = await this.userRepository.findByRole(dto, USER_ROLE.STUDENT);

    return plainToInstance(StudentGetListRO, data, {
      excludeExtraneousValues: true,
    });
  }
}
