import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { SubmitRepository } from './submit.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { SubmitGetListDTO, SubmitStoreDTO } from './dto/submit.dto';
import { SubmitEntity } from './submit.entity';
import { ResultRO } from '../common/ro/result.ro';
import { SubmitGetListDataRO, SubmitStoreRO } from './ro/submit.ro';

@Injectable()
export class SubmitService extends BaseService {
  private readonly logger = new Logger(SubmitService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly submitRepository: SubmitRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: SubmitStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    let response: SubmitStoreRO;

    try {
      const submitData = new SubmitEntity({
        exerciseId: dto.exerciseId,
        createdBy: actorId,
      });
      const submit = await this.submitRepository.insert(submitData);

      response = new SubmitStoreRO({
        id: submit.id,
        exerciseId: submit.exerciseId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.SUBMIT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response,
      message: 'Submit stored successfully',
      actorId,
    });
  }

  async getList(dto: SubmitGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = this.submitRepository.find(dto);

      return this.success({
        classRO: SubmitGetListDataRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.SUBMIT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateStore(dto: SubmitStoreDTO, actorId: number) {
    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countById(dto.exerciseId);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
