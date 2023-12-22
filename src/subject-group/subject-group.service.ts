import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { SubjectGroupRepository } from './subject-group.repository';
import { SubjectRepository } from '../subject/subject.repository';
import { GroupRepository } from '../group/group.repository';
import { ElasticsearchLoggerService } from 'src/elastic-search-logger/elastic-search-logger.service';
import { SubjectGroupBulkStoreDTO } from './dto/subject-group.dto';
import { SubjectGroupEntity } from './subject-group.entity';
import { ResultRO } from 'src/common/ro/result.ro';

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
          (groupId) => new SubjectGroupEntity({ subjectId, groupId }),
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

  async validateBulkStore(dto: SubjectGroupBulkStoreDTO, actorId: string) {
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
}
