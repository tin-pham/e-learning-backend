import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { SubjectGroupEntity } from './subject-group.entity';
import { SubjectGroupRepository } from './subject-group.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { GroupRepository } from '../group/group.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import {
  SubjectGroupBulkDeleteDTO,
  SubjectGroupBulkStoreDTO,
} from './dto/subject-group.dto';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class SubjectGroupService extends BaseService {
  private readonly logger = new Logger(SubjectGroupService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly subjectGroupRepository: SubjectGroupRepository,
    private readonly subjectRepository: SubjectRepository,
    private readonly groupRepository: GroupRepository,
  ) {
    super(elasticLogger);
  }

  async bulkStore(dto: SubjectGroupBulkStoreDTO, decoded: IJwtPayload) {
    const { subjectIds, groupIds } = dto;
    const actorId = decoded.userId;
    await this.validateBulkStore(dto, actorId);

    try {
      const subjectGroupsData = subjectIds.flatMap((subjectId) =>
        groupIds.map(
          (groupId) =>
            new SubjectGroupEntity({ subjectId, groupId, createdBy: actorId }),
        ),
      );
      await this.subjectGroupRepository.insertMultiple(subjectGroupsData);
    } catch (error) {
      const { code, status, message } =
        EXCEPTION.SUBJECT_GROUP.BULK_STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Subject group stored successfully',
      actorId,
    });
  }

  async bulkDelete(dto: SubjectGroupBulkDeleteDTO, decoded: IJwtPayload) {
    const { subjectIds, groupIds } = dto;
    const actorId = decoded.userId;

    await this.validateBulkDelete(dto, actorId);

    try {
      await this.subjectGroupRepository.deleteMultiple(
        subjectIds,
        groupIds,
        actorId,
      );
    } catch (error) {
      const { code, status, message } =
        EXCEPTION.SUBJECT_GROUP.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId, error });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Subject group deleted successfully',
      actorId,
    });
  }

  private async validateBulkStore(
    dto: SubjectGroupBulkStoreDTO,
    actorId: number,
  ) {
    const { subjectIds, groupIds } = dto;
    // Check subjects exists
    const subjectCount = await this.subjectRepository.countByIds(subjectIds);
    if (subjectCount !== subjectIds.length) {
      const { code, status, message } = EXCEPTION.SUBJECT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check groups exists
    const groupCount = await this.groupRepository.countByIds(groupIds);
    if (groupCount !== groupIds.length) {
      const { code, status, message } = EXCEPTION.GROUP.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check subjectGroup unique
    const subjectGroupCount =
      await this.subjectGroupRepository.countBySubjectIdsAndGroupIds(
        subjectIds,
        groupIds,
      );
    if (subjectGroupCount) {
      const { code, status, message } = EXCEPTION.SUBJECT_GROUP.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(
    dto: SubjectGroupBulkDeleteDTO,
    actorId: number,
  ) {
    const { subjectIds, groupIds } = dto;
    // Check subjects exists
    const subjectCount = await this.subjectRepository.countByIds(subjectIds);
    if (subjectCount !== subjectIds.length) {
      const { code, status, message } = EXCEPTION.SUBJECT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check groups exists
    const groupCount = await this.groupRepository.countByIds(groupIds);
    if (groupCount !== groupIds.length) {
      const { code, status, message } = EXCEPTION.GROUP.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check duplicate
    const subjectGroupCount =
      await this.subjectGroupRepository.countBySubjectIdsAndGroupIds(
        subjectIds,
        groupIds,
      );
    if (!subjectGroupCount) {
      const { code, status, message } = EXCEPTION.SUBJECT_GROUP.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
