import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';
import { TeacherEntity } from './teacher.entity';
import { TeacherRepository } from './teacher.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserService } from '../user/user.service';
import { TeacherStoreDTO, TeacherUpdateDTO } from './dto/teacher.dto';
import { UserGetListDTO } from '../user/dto/user.dto';
import {
  TeacherDeleteRO,
  TeacherGetDetailRO,
  TeacherGetListRO,
  TeacherStoreRO,
  TeacherUpdateRO,
} from './ro/teacher.ro';

@Injectable()
export class TeacherService extends UserService {
  private readonly logger = new Logger(TeacherService.name);

  constructor(
    userRepository: UserRepository,
    roleRepository: RoleRepository,
    userRoleRepository: UserRoleRepository,
    private readonly database: DatabaseService,
    private readonly teacherRepository: TeacherRepository,
  ) {
    super(userRepository, roleRepository, userRoleRepository);
  }

  async store(dto: TeacherStoreDTO, decoded: IJwtPayload) {
    await super.validateStore(dto);
    const response = new TeacherStoreRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store user
        const user = await super.storeWithTransaction(
          transaction,
          dto,
          decoded.userId,
        );

        // Get teacher role id
        const { id: roleId } = await this.roleRepository.getIdByName(
          USER_ROLE.TEACHER,
        );

        // Store user role
        await super.storeUserRoleWithTransaction(transaction, user.id, roleId);

        // Store teacher
        const teacherData = new TeacherEntity();
        teacherData.userId = user.id;
        const { id } = await this.teacherRepository.storeWithTransaction(
          transaction,
          teacherData,
        );

        // Set response
        response.id = id;
        response.username = user.username;
        response.email = user.email;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER.STORE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(TeacherStoreRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async getList(dto: UserGetListDTO) {
    const data = await this.teacherRepository.find(dto);

    return plainToInstance(TeacherGetListRO, data, {
      excludeExtraneousValues: true,
    });
  }

  async getDetail(id: string) {
    const teacher = await this.teacherRepository.findUserById(id);

    if (!teacher) {
      const { code, status, message } = EXCEPTION.TEACHER.NOT_FOUND;
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(TeacherGetDetailRO, teacher, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: TeacherUpdateDTO, decoded: IJwtPayload) {
    await this.validateUpdate(id, dto);

    const response = new TeacherUpdateRO();

    try {
      const { userId } = await this.teacherRepository.getUserIdByTeacherId(id);
      await this.database.transaction().execute(async (transaction) => {
        // Update user
        const user = await super.updateWithTransaction(
          transaction,
          userId,
          dto,
          decoded.userId,
        );

        // Set response
        const { id: teacherId } = await this.teacherRepository.getIdByUserId(
          user.id,
        );
        if (!teacherId) {
          throw new InternalServerErrorException();
        }
        response.id = teacherId;
        response.username = user.username;
        response.email = user.email;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER.UPDATE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(TeacherUpdateRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string, decoded: IJwtPayload) {
    await this.validateDelete(id);

    try {
      const { userId } = await this.teacherRepository.getUserIdByTeacherId(id);
      await this.database.transaction().execute(async (transaction) => {
        // Delete user
        await super.deleteWithTransaction(transaction, userId, decoded.userId);
        // Delete user role
        await super.deleteUserRoleWithTransaction(transaction, userId);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.TEACHER.DELETE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(
      TeacherDeleteRO,
      {
        id,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  private async validateUpdate(id: string, dto: TeacherUpdateDTO) {
    // Check id exists
    const teacher = await this.teacherRepository.findOneById(id);
    if (!teacher) {
      const { code, status, message } = EXCEPTION.TEACHER.DOES_NOT_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }

    // Check email unique
    if (dto.email) {
      const emailCount = await this.userRepository.countByEmailExceptId(
        dto.email,
        teacher.userId,
      );
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
      const phoneCount = await this.userRepository.countByPhoneExceptId(
        dto.phone,
        teacher.userId,
      );
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

  private async validateDelete(id: string) {
    // Check id exists
    const teacherCount = await this.teacherRepository.countById(id);
    if (!teacherCount) {
      const { code, status, message } = EXCEPTION.TEACHER.DOES_NOT_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }
  }
}
