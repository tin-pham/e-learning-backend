import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';
import { StudentEntity } from './student.entity';
import { UserEntity } from '../user/user.entity';
import { StudentRepository } from './student.repository';
import { UserRepository } from 'src/user/user.repository';
import { RoleRepository } from 'src/role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserService } from '../user/user.service';
import { StudentStoreDTO, StudentUpdateDTO } from './dto/student.dto';
import { UserGetListDTO } from '../user/dto/user.dto';
import {
  StudentGetDetailRO,
  StudentGetListRO,
  StudentStoreRO,
  StudentUpdateRO,
} from './ro/student.ro';

@Injectable()
export class StudentService extends UserService {
  private readonly logger = new Logger(StudentService.name);

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
    await super.validateStore(dto);
    const response = new StudentStoreRO();

    try {
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
        const { id } = await this.studentRepository.storeWithTransaction(
          transaction,
          studentData,
        );

        // Set response
        response.id = id;
        response.username = user.username;
        response.email = user.email;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT.STORE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(StudentStoreRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async getList(dto: UserGetListDTO) {
    const data = await this.studentRepository.find(dto);

    return plainToInstance(StudentGetListRO, data, {
      excludeExtraneousValues: true,
    });
  }

  async getDetail(id: string) {
    const student = await this.studentRepository.findOneById(id);

    if (!student) {
      const { code, status, message } = EXCEPTION.STUDENT.NOT_FOUND;
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(StudentGetDetailRO, student, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: StudentUpdateDTO, decoded: IJwtPayload) {
    await this.validateUpdate(id, dto);

    const response = new StudentUpdateRO();

    try {
      const userData = new UserEntity();
      userData.updatedBy = decoded.userId;
      userData.updatedAt = new Date();
      if (dto.email) {
        userData.email = dto.email;
      }
      if (dto.phone) {
        userData.phone = dto.phone;
      }
      if (dto.displayName) {
        userData.displayName = dto.displayName;
      }
      const user = await this.userRepository.updateByStudentId(id, userData);
      const { id: studentId } = await this.studentRepository.getIdByUserId(
        user.id,
      );
      if (!studentId) {
        throw new InternalServerErrorException();
      }

      response.id = studentId;
      response.userId = user.id;
      response.username = user.username;
      response.email = user.email;
      response.phone = user.phone;
      response.displayName = user.displayName;
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT.UPDATE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(StudentUpdateRO, response, {
      excludeExtraneousValues: true,
    });
  }

  private async validateUpdate(id: string, dto: StudentUpdateDTO) {
    // Check id exists
    const studentCount = await this.studentRepository.countById(id);
    if (!studentCount) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }

    // Check email unique
    if (dto.email) {
      const emailCount = await this.userRepository.countByEmail(dto.email);
      if (emailCount) {
        const { code, status, message } = EXCEPTION.USER.EMAIL_ALREADY_EXISTS;
        this.formatException({
          code,
          status,
          message,
        });
      }
    }

    // Check phone unique
    if (dto.phone) {
      const phoneCount = await this.userRepository.countByPhone(dto.phone);
      if (phoneCount) {
        const { code, status, message } = EXCEPTION.USER.PHONE_ALREADY_EXISTS;
        this.formatException({
          code,
          status,
          message,
        });
      }
    }
  }
}
