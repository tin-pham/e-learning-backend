import { Injectable, Logger } from '@nestjs/common';
import { EXCEPTION, IJwtPayload } from '../common';
import { BaseService } from '../base';
import { GroupEntity } from './group.entity';
import { GroupRepository } from './group.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { GroupStoreDTO, GroupUpdateDTO } from './dto/group.dto';
import { GroupGetListRO, GroupStoreRO, GroupUpdateRO } from './ro/group.ro';

@Injectable()
export class GroupService extends BaseService {
  private readonly logger = new Logger(GroupService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly groupRepository: GroupRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: GroupStoreDTO, payload: IJwtPayload) {
    const actorId = payload.userId;
    await this.validateStore(dto, actorId);

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
      this.throwException({
        code,
        status,
        message,
        actorId,
      });
    }

    return this.success({
      classRO: GroupStoreRO,
      response,
      message: 'Group stored successfully',
      actorId,
    });
  }

  async getList(decoded: IJwtPayload) {
    try {
      const groups = await this.groupRepository.find();
      return this.success({
        classRO: GroupGetListRO,
        response: groups,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.GROUP.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({
        code,
        status,
        message,
        actorId: decoded.userId,
      });
    }
  }

  async update(id: string, dto: GroupUpdateDTO, payload: IJwtPayload) {
    const actorId = payload.userId;
    await this.validateUpdate(id, dto, actorId);

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
      this.throwException({
        code,
        status,
        message,
        actorId,
      });
    }

    return this.success({
      classRO: GroupUpdateRO,
      response,
      message: 'Group updated successfully',
      actorId,
    });
  }

  private async validateStore(dto: GroupStoreDTO, actorId: string) {
    // Check name exist
    const nameCount = await this.groupRepository.countByName(dto.name);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.GROUP.ALREADY_EXIST;
      this.throwException({
        code,
        status,
        message,
        actorId,
      });
    }
  }

  private async validateUpdate(
    id: string,
    dto: GroupUpdateDTO,
    actorId: string,
  ) {
    // Check exist
    const groupCount = await this.groupRepository.countById(id);
    if (!groupCount) {
      const { code, status, message } = EXCEPTION.GROUP.DOES_NOT_EXIST;
      this.throwException({
        code,
        status,
        message,
        actorId,
      });
    }

    // Check name unique
    const duplicateNameCount = await this.groupRepository.countByNameExceptId(
      dto.name,
      id,
    );
    if (duplicateNameCount) {
      const { code, status, message } = EXCEPTION.GROUP.ALREADY_EXIST;
      this.throwException({
        code,
        status,
        message,
        actorId,
      });
    }
  }
}
