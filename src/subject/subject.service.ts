import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { SubjectEntity } from './subject.entity';
import { SubjectRepository } from './subject.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { SubjectGetListDTO, SubjectStoreDTO } from './dto/subject.dto';
import { SubjectGetListRO, SubjectStoreRO } from './ro/subject.ro';

@Injectable()
export class SubjectService extends BaseService {
  private readonly logger = new Logger(SubjectService.name);
  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly subjectRepository: SubjectRepository,
  ) {
    super(elasticLogger);
  }
  async store(dto: SubjectStoreDTO, payload: IJwtPayload) {
    const actorId = payload.userId;
    await this.validateStore(dto, actorId);

    const response = new SubjectStoreRO();

    try {
      const subjectData = new SubjectEntity();
      subjectData.name = dto.name;
      subjectData.createdBy = actorId;
      const subject = await this.subjectRepository.insert(subjectData);

      response.id = subject.id;
      response.name = subject.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.SUBJECT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({
        code,
        status,
        message,
        actorId,
      });
    }

    return this.success({
      classRO: SubjectStoreRO,
      response,
      message: 'Subject stored successfully',
      actorId,
    });
  }

  async getList(dto: SubjectGetListDTO, decoded: IJwtPayload) {
    try {
      const subjects = await this.subjectRepository.find(dto);

      return this.success({
        classRO: SubjectGetListRO,
        response: subjects,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.SUBJECT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({
        code,
        status,
        message,
        actorId: decoded.userId,
      });
    }
  }

  private async validateStore(dto: SubjectStoreDTO, actorId: string) {
    // Check name exists
    const nameCount = await this.subjectRepository.countByName(dto.name);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.SUBJECT.ALREADY_EXIST;
      this.throwException({
        code,
        status,
        message,
        actorId,
      });
    }
  }
}
