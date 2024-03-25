import { Injectable, Logger } from '@nestjs/common';
import * as bcrypt from 'bcryptjs';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService, Transaction } from '../database';
import { UserRoleEntity } from '../user-role/user-role.entity';
import { UserEntity } from './user.entity';
import { UserRepository } from './user.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { RoleRepository } from '../role/role.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { UserStoreDTO, UserUpdateDTO } from './dto/user.dto';
import { UserGetProfileRO, UserUpdateRO } from './ro/user.ro';
import { S3Service } from '../s3/s3.service';

@Injectable()
export class UserService extends BaseService {
  private readonly _logger = new Logger(UserService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    protected readonly userRepository: UserRepository,
    protected readonly roleRepository: RoleRepository,
    protected readonly userRoleRepository: UserRoleRepository,
    protected readonly database: DatabaseService,
    protected readonly s3Service: S3Service,
  ) {
    super(elasticLogger);
  }

  async getProfile(decoded: IJwtPayload) {
    const actorId = decoded.userId;
    let response: any;
    try {
      response = await this.userRepository.findOneById(decoded.userId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.USER.GET_PROFILE_FAILED;
      this._logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!response) {
      const { code, status, message } = EXCEPTION.USER.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: UserGetProfileRO,
      response,
    });
  }

  async updateProfile(dto: UserUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this._validateUpdate(dto, actorId);

    const data = new UserEntity();

    data.updatedBy = actorId;
    data.updatedAt = new Date();

    if (dto.displayName) {
      data.displayName = dto.displayName;
    }

    if (dto.email) {
      data.email = dto.email;
    }

    if (dto.phone) {
      data.phone = dto.phone;
    }

    if (dto.password) {
      const salt = await bcrypt.genSalt(10);
      const hashedPassword = await bcrypt.hash(dto.password, salt);
      data.password = hashedPassword;
    }

    let user: any;
    try {
      user = await this.userRepository.update(actorId, data);
    } catch (error) {
      const { code, status, message } = EXCEPTION.USER.UPDATE_PROFILE_FAILED;
      this._logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: UserUpdateRO,
      response: new UserUpdateRO(user),
      message: 'Update user successfully',
      actorId,
    });
  }

  protected async storeWithTransaction(transaction: Transaction, dto: UserStoreDTO, decoded: IJwtPayload) {
    const { userId: actorId } = decoded;
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(dto.password, salt);
    const userData = new UserEntity();
    userData.username = dto.username;
    userData.password = hashedPassword;
    userData.email = dto.email;
    userData.phone = dto.phone;
    userData.displayName = dto.displayName;
    userData.createdBy = actorId;

    const user = await this.userRepository.insertWithTransaction(transaction, userData);
    return user;
  }

  protected async storeUserRoleWithTransaction(transaction: Transaction, userId: number, roleId: number) {
    const userRoleData = new UserRoleEntity();
    userRoleData.userId = userId;
    userRoleData.roleId = roleId;
    await this.userRoleRepository.insertWithTransaction(transaction, userRoleData);
  }

  protected async validateStore(dto: UserStoreDTO, actorId: number) {
    // Check name exists
    const userNameCount = await this.userRepository.countByUserName(dto.username);
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

  protected async updateWithTransaction(transaction: Transaction, id: number, dto: UserUpdateDTO, actorId: number) {
    // Set data
    const userData = new UserEntity();
    userData.updatedBy = actorId;
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
    const user = await this.userRepository.updateWithTransaction(transaction, id, userData);

    return user;
  }

  protected async deleteWithTransaction(transaction: Transaction, id: number, actorId: number) {
    const userData = new UserEntity();
    userData.deletedAt = new Date();
    userData.deletedBy = actorId;
    await this.userRepository.deleteWithTransaction(transaction, id, userData);
  }

  protected async deleteUserRoleWithTransaction(transaction: Transaction, userId: number, actorId: number) {
    await this.userRoleRepository.deleteMultipleByUserIdWithTransaction(transaction, userId, actorId);
  }

  protected async _validateUpdate(dto: UserUpdateDTO, actorId: number) {
    // Check exist
    const userCount = await this.userRepository.countById(actorId);
    if (!userCount) {
      const { status, message, code } = EXCEPTION.USER.DOES_NOT_EXIST;
      this.throwException({ status, message, code, actorId });
    }

    // Check email unique
    if (dto.email) {
      const emailCount = await this.userRepository.countByEmailExceptId(dto.email, actorId);
      if (emailCount) {
        const { status, message, code } = EXCEPTION.USER.EMAIL_ALREADY_EXISTS;
        this.throwException({ status, message, code, actorId });
      }
    }

    // Check phone unique
    if (dto.phone) {
      const phoneCount = await this.userRepository.countByPhoneExceptId(dto.phone, actorId);
      if (phoneCount) {
        const { status, message, code } = EXCEPTION.USER.PHONE_ALREADY_EXISTS;
        this.throwException({ status, message, code, actorId });
      }
    }
  }
}
