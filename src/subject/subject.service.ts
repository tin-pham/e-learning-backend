import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { SubjectGetListDTO, SubjectStoreDTO } from './dto/subject.dto';
import { SubjectRepository } from './subject.repository';
import { SubjectEntity } from './subject.entity';
import { SubjectGetListRO, SubjectStoreRO } from './ro/subject.ro';
import { plainToInstance } from 'class-transformer';

@Injectable()
export class SubjectService extends BaseService {
  private readonly logger = new Logger(SubjectService.name);
  constructor(private readonly subjectRepository: SubjectRepository) {
    super();
  }
  async store(dto: SubjectStoreDTO, payload: IJwtPayload) {
    await this.validateStore(dto);

    const response = new SubjectStoreRO();

    try {
      const subjectData = new SubjectEntity();
      subjectData.name = dto.name;
      subjectData.createdBy = payload.userId;
      const subject = await this.subjectRepository.insert(subjectData);

      response.id = subject.id;
      response.name = subject.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.SUBJECT.STORE_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return plainToInstance(SubjectStoreRO, response, {
      excludeExtraneousValues: true,
    });
  }

  async getList(dto: SubjectGetListDTO) {
    let result = new SubjectGetListRO();
    try {
      const data = await this.subjectRepository.find(dto);

      result = plainToInstance(SubjectGetListRO, data, {
        excludeExtraneousValues: true,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.SUBJECT.GET_LIST_FAILED;
      this.logger.error(error);
      this.formatException({
        code,
        status,
        message,
      });
    }

    return result;
  }

  private async validateStore(dto: SubjectStoreDTO) {
    // Check name exists
    const nameCount = await this.subjectRepository.countByName(dto.name);
    if (nameCount) {
      const { code, status, message } = EXCEPTION.SUBJECT.ALREADY_EXIST;
      this.formatException({
        code,
        status,
        message,
      });
    }
  }
}
