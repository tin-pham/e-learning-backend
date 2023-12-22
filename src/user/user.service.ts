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
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { UserStoreDTO, UserUpdateDTO } from './dto/user.dto';

@Injectable()
export class UserService extends BaseService {
  constructor(
    elasticLogger: ElasticsearchLoggerService,
    protected readonly userRepository: UserRepository,
    protected readonly roleRepository: RoleRepository,
    protected readonly userRoleRepository: UserRoleRepository,
  ) {
    super(elasticLogger);
  }

  protected async storeWithTransaction(
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

  protected async validateStore(dto: UserStoreDTO, actorId: string) {
    // Check name exists
    const userNameCount = await this.userRepository.countByUserName(
      dto.username,
    );
    if (userNameCount) {
      const { status, code, message } = EXCEPTION.USER.USERNAME_ALREADY_EXISTS;
      this.throwException({ status, code, message, actorId });
    }

    // Check email exists
    if (dto.email) {
      const emailCount = await this.userRepository.countByEmail(dto.email);
      if (emailCount) {
        const { status, code, message } = EXCEPTION.USER.EMAIL_ALREADY_EXISTS;
        this.throwException({ status, code, message, actorId });
      }
    }

    // Check phone exists
    if (dto.phone) {
      const phoneCount = await this.userRepository.countByPhone(dto.phone);
      if (phoneCount) {
        const { status, code, message } = EXCEPTION.USER.PHONE_ALREADY_EXISTS;
        this.throwException({ status, code, message, actorId });
      }
    }
  }

  protected async updateWithTransaction(
    transaction: Transaction,
    id: string,
    dto: UserUpdateDTO,
    updaterId: string,
  ) {
    // Set data
    const userData = new UserEntity();
    userData.updatedBy = updaterId;
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
    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      userData.password = hashedPassword;
    }

    // Update user
    const user = await this.userRepository.updateWithTransaction(
      transaction,
      id,
      userData,
    );
    return user;
  }

  protected async deleteWithTransaction(
    transaction: Transaction,
    id: string,
    deleterId: string,
  ) {
    const userData = new UserEntity();
    userData.deletedAt = new Date();
    userData.deletedBy = deleterId;
    await this.userRepository.deleteWithTransaction(transaction, id, userData);
  }

  protected async deleteUserRoleWithTransaction(
    transaction: Transaction,
    userId: string,
  ) {
    await this.userRoleRepository.deleteMultipleByUserIdWithTransaction(
      transaction,
      userId,
    );
  }
}
