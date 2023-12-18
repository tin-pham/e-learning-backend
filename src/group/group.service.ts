import { Injectable, Logger } from '@nestjs/common';
import { EXCEPTION, IJwtPayload } from '../common';
import { BaseService } from '../base';
import { GroupRepository } from './group.repository';
import { GroupStoreDTO, GroupUpdateDTO } from './dto/group.dto';
import { GroupGetListRO, GroupStoreRO, GroupUpdateRO } from './ro/group.ro';
import { GroupEntity } from './group.entity';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class GroupService extends BaseService {
  private readonly logger = new Logger(GroupService.name);

  constructor(private readonly groupRepository: GroupRepository) {
    super();
  }

  async store(dto: GroupStoreDTO, payload: IJwtPayload) {
    await this.validateStore(dto);

    const response = new GroupStoreRO();

    try {
      const groupData = new GroupEntity();
      groupData.name = dto.name;
      groupData.createdBy = payload.userId;
      const group = await this.groupRepository.insert(groupData);

      response.id = group.id;
      response.name = group.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.GROUP.STORE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(GroupStoreRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async getList() {
    const response = new GroupGetListRO();
    try {
      const groups = await this.groupRepository.find();

      response.data = groups;
    } catch (error) {
      const { code, status, message } = EXCEPTION.GROUP.GET_LIST_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(GroupGetListRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async update(id: string, dto: GroupUpdateDTO, payload: IJwtPayload) {
    await this.validateUpdate(id, dto);

    const response = new GroupUpdateRO();

    try {
      const groupData = new GroupEntity();
      groupData.updatedBy = payload.userId;
      if (dto.name) {
        groupData.name = dto.name;
      }

      const group = await this.groupRepository.update(id, groupData);

      response.id = group.id;
      response.name = group.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.GROUP.UPDATE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(GroupUpdateRO, response, {
      excludeExtraneousValues: true,
    });
  }

  private async validateStore(dto: GroupStoreDTO) {
    // Check name exist
    const nameCount = await this.groupRepository.countByName(dto.name);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.GROUP.ALREADY_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }
  }

  private async validateUpdate(id: string, dto: GroupUpdateDTO) {
    // Check exist
    const groupCount = await this.groupRepository.countById(id);
    if (!groupCount) {
      const { code, status, message } = EXCEPTION.GROUP.DOES_NOT_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }

    // Check name unique
    const duplicateNameCount = await this.groupRepository.countByNameExceptId(
      dto.name,
      id,
    );
    if (duplicateNameCount) {
      const { code, status, message } = EXCEPTION.GROUP.ALREADY_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }
  }
}
