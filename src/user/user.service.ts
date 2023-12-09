import { Injectable, Logger } from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '../base';
import { EXCEPTION } from '../common';
import { DatabaseService } from '../database';
import { UserEntity } from './user.entity';
import { UserRoleEntiy } from '../user-role/user-role.entity';
import { UserRepository } from './user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';
import { UserStoreDTO } from './dto/user.dto';
import { UserGetDetailRO, UserStoreRO } from './ro/user.ro';

@Injectable()
export class UserService extends BaseService {
  private readonly logger = new Logger(UserService.name);

  constructor(
    private readonly userRepository: UserRepository,
    private readonly roleRepository: RoleRepository,
    private readonly userRoleRepository: UserRoleRepository,
    private readonly databaseService: DatabaseService,
  ) {
    super();
  }

  async store(dto: UserStoreDTO) {
    await this.validateStore(dto);

    const response = new UserStoreRO();

    try {
      await this.databaseService.transaction().execute(async (transaction) => {
        // Store user
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(dto.password, salt);
        const userData = new UserEntity();
        userData.username = dto.username;
        userData.password = hashedPassword;
        userData.email = dto.email;
        userData.phone = dto.phone;
        userData.displayName = dto.displayName;
        const user = await this.userRepository.insertWithTransaction(
          transaction,
          userData,
        );
        response.username = user.username;
        response.email = user.email;
        response.phone = user.phone;
        response.displayName = user.displayName;

        // Store user role
        const userRolesData = dto.roleIds.map((roleId) => {
          const userRole = new UserRoleEntiy();
          userRole.userId = user.id;
          userRole.roleId = roleId;
          return userRole;
        });
        await this.userRoleRepository.insertMultipleWithTransaction(
          transaction,
          userRolesData,
        );
      });
    } catch (error) {
      this.logger.error(error);
      const { status, code, message } = EXCEPTION.USER.FAILED_TO_CREATE;
      this.formatException({
        status,
        code,
        message,
      });
    }

    return plainToInstance(UserStoreRO, response, { strategy: 'exposeAll' });
  }

  async getDetail(id: string) {
    let user: UserEntity;
    try {
      // Get user
      user = await this.userRepository.findOneById(id);
      if (!user) {
        const { status, code, message } = EXCEPTION.USER.NOT_FOUND;
        this.formatException({ status, code, message });
      }

      // Get roles
      user.roles = await this.userRoleRepository.findRolesByUserId(id);
    } catch (error) {
      this.logger.error(error);
      const { status, code, message } = EXCEPTION.USER.FAILED_TO_GET_DETAIL;
      this.formatException({ status, code, message });
    }

    return plainToInstance(UserGetDetailRO, user, { strategy: 'exposeAll' });
  }

  private async validateStore(dto: UserStoreDTO) {
    // Check name exists
    const userNameCount = await this.userRepository.countByUserName(
      dto.username,
    );
    if (userNameCount) {
      const { status, code, message } = EXCEPTION.USER.USERNAME_ALREADY_EXISTS;
      this.formatException({
        status,
        code,
        message,
      });
    }

    // Check email exists
    if (dto.email) {
      const emailCount = await this.userRepository.countByEmail(dto.email);
      if (emailCount) {
        const { status, code, message } = EXCEPTION.USER.EMAIL_ALREADY_EXISTS;
        this.formatException({
          status,
          code,
          message,
        });
      }
    }

    // Check role exists
    const roleCount = await this.roleRepository.countByIds(dto.roleIds);
    if (roleCount !== dto.roleIds.length) {
      const { status, code, message } = EXCEPTION.ROLE.DOES_NOT_EXIST;
      this.formatException({
        status,
        code,
        message,
      });
    }
  }
}
