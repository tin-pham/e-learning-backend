import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '../base';
import { EXCEPTION } from '../common';
import { Transaction } from '../database';
import { UserRoleEntity } from '../user-role/user-role.entity';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';
import { UserStoreDTO } from './dto/user.dto';

@Injectable()
export class UserService extends BaseService {
  constructor(
    protected readonly userRepository: UserRepository,
    protected readonly roleRepository: RoleRepository,
    protected readonly userRoleRepository: UserRoleRepository,
  ) {
    super();
  }

  protected async storeUserWithTransaction(
    transaction: Transaction,
    dto: UserStoreDTO,
    creatorId: string,
  ) {
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const userData = new UserEntity();
    userData.username = dto.username;
    userData.password = hashedPassword;
    userData.email = dto.email;
    userData.phone = dto.phone;
    userData.displayName = dto.displayName;
    userData.createdBy = creatorId;
    return this.userRepository.insertWithTransaction(transaction, userData);
  }

  protected async storeUserRoleWithTransaction(
    transaction: Transaction,
    userId: string,
    roleId: string,
  ) {
    const userRoleData = new UserRoleEntity();
    userRoleData.userId = userId;
    userRoleData.roleId = roleId;
    await this.userRoleRepository.insertWithTransaction(
      transaction,
      userRoleData,
    );
  }

  protected async validateStore(dto: UserStoreDTO) {
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
  }
}
