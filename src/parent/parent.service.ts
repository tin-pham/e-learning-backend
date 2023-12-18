import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { plainToInstance } from 'class-transformer';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';
import { ParentEntity } from './parent.entity';
import { ParentRepository } from './parent.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserService } from '../user/user.service';
import { ParentStoreDTO, ParentUpdateDTO } from './dto/parent.dto';
import { UserGetListDTO } from '../user/dto/user.dto';
import {
  ParentDeleteRO,
  ParentGetDetailRO,
  ParentGetListRO,
  ParentStoreRO,
  ParentUpdateRO,
} from './ro/parent.ro';

@Injectable()
export class ParentService extends UserService {
  private readonly logger = new Logger(ParentService.name);

  constructor(
    userRepository: UserRepository,
    roleRepository: RoleRepository,
    userRoleRepository: UserRoleRepository,
    private readonly database: DatabaseService,
    private readonly parentRepository: ParentRepository,
  ) {
    super(userRepository, roleRepository, userRoleRepository);
  }

  async store(dto: ParentStoreDTO, decoded: IJwtPayload) {
    await super.validateStore(dto);
    const response = new ParentStoreRO();

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store user
        const user = await super.storeWithTransaction(
          transaction,
          dto,
          decoded.userId,
        );

        // Get parent role id
        const { id: roleId } = await this.roleRepository.getIdByName(
          USER_ROLE.PARENT,
        );

        // Store user role
        await super.storeUserRoleWithTransaction(transaction, user.id, roleId);

        // Store parent
        const parentData = new ParentEntity();
        parentData.userId = user.id;
        const { id } = await this.parentRepository.insertWithTransaction(
          transaction,
          parentData,
        );

        // Set response
        response.id = id;
        response.username = user.username;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.PARENT.STORE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(ParentStoreRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async getList(dto: UserGetListDTO) {
    const data = await this.parentRepository.find(dto);

    return plainToInstance(ParentGetListRO, data, {
      excludeExtraneousValues: true,
    });
  }

  async getDetail(id: string) {
    const parent = await this.parentRepository.findUserById(id);

    if (!parent) {
      const { code, status, message } = EXCEPTION.TEACHER.NOT_FOUND;
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(ParentGetDetailRO, parent, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: ParentUpdateDTO, decoded: IJwtPayload) {
    await this.validateUpdate(id, dto);

    const response = new ParentUpdateRO();

    try {
      const { userId } = await this.parentRepository.getUserIdByParentId(id);
      await this.database.transaction().execute(async (transaction) => {
        // Update user
        const user = await super.updateWithTransaction(
          transaction,
          userId,
          dto,
          decoded.userId,
        );

        // Set response
        const { id: parentId } = await this.parentRepository.getIdByUserId(
          user.id,
        );
        if (!parentId) {
          throw new InternalServerErrorException();
        }
        response.id = parentId;
        response.username = user.username;
        response.phone = user.phone;
        response.displayName = user.displayName;
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.PARENT.UPDATE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(ParentUpdateRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async delete(id: string, decoded: IJwtPayload) {
    await this.validateDelete(id);

    try {
      const { userId } = await this.parentRepository.getUserIdByParentId(id);
      await this.database.transaction().execute(async (transaction) => {
        // Delete user
        await super.deleteWithTransaction(transaction, userId, decoded.userId);
        // Delete user role
        await super.deleteUserRoleWithTransaction(transaction, userId);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.PARENT.DELETE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(
      ParentDeleteRO,
      {
        id,
      },
      {
        excludeExtraneousValues: true,
      },
    );
  }

  private async validateUpdate(id: string, dto: ParentUpdateDTO) {
    // Check id exists
    const parent = await this.parentRepository.findOneById(id);
    if (!parent) {
      const { code, status, message } = EXCEPTION.PARENT.DOES_NOT_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }

    // Check phone unique
    if (dto.phone) {
      const phoneCount = await this.userRepository.countByPhoneExceptId(
        dto.phone,
        parent.userId,
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
    const parentCount = await this.parentRepository.countById(id);
    if (!parentCount) {
      const { code, status, message } = EXCEPTION.PARENT.DOES_NOT_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }
  }
}
