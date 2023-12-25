import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { ROLE } from '../role/enum/role.enum';
import { ParentEntity } from './parent.entity';
import { ParentRepository } from './parent.repository';
import { UserRepository } from '../user/user.repository';
import { RoleRepository } from '../role/role.repository';
import { UserRoleRepository } from '../user-role/user-role.repository';
import { UserService } from '../user/user.service';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
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
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly parentRepository: ParentRepository,
  ) {
    super(elasticLogger, userRepository, roleRepository, userRoleRepository);
  }

  async store(dto: ParentStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await super.validateStore(dto, actorId);

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
          ROLE.PARENT,
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
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ParentStoreRO,
      response,
      message: 'Parent created successfully',
      actorId,
    });
  }

  async getList(dto: UserGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.parentRepository.find(dto);
      return this.success({
        classRO: ParentGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.PARENT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }
  }

  async getDetail(id: string, decoded: IJwtPayload) {
    const response = new ParentGetDetailRO();
    const actorId = decoded.userId;

    try {
      const parent = await this.parentRepository.findUserById(id);
      if (!parent) {
        const { code, status, message } = EXCEPTION.PARENT.NOT_FOUND;
        this.throwException({ code, status, message, actorId });
      }

      response.id = parent.id;
      response.username = parent.username;
      response.phone = parent.phone;
      response.displayName = parent.displayName;
    } catch (error) {
      const { code, status, message } = EXCEPTION.PARENT.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({ classRO: ParentGetDetailRO, response });
  }

  async update(id: string, dto: ParentUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, dto, actorId);

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
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ParentUpdateRO,
      response,
      message: 'Parent updated successfully',
      actorId,
    });
  }

  async delete(id: string, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

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
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ParentDeleteRO,
      response: {
        id,
      },
      message: 'Parent deleted successfully',
      actorId,
    });
  }

  private async validateUpdate(
    id: string,
    dto: ParentUpdateDTO,
    actorId: string,
  ) {
    // Check id exists
    const parent = await this.parentRepository.findOneById(id);
    if (!parent) {
      const { code, status, message } = EXCEPTION.PARENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check phone unique
    if (dto.phone) {
      const phoneCount = await this.userRepository.countByPhoneExceptId(
        dto.phone,
        parent.userId,
      );
      if (phoneCount) {
        const { code, status, message } = EXCEPTION.USER.PHONE_ALREADY_EXISTS;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateDelete(id: string, actorId: string) {
    // Check id exists
    const parentCount = await this.parentRepository.countById(id);
    if (!parentCount) {
      const { code, status, message } = EXCEPTION.PARENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
