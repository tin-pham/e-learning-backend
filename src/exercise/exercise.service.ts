import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { ExerciseRepository } from './exercise.repository';
import { SectionExerciseRepository } from '../section-exercise/section-exercise.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseGetListDTO, ExerciseStoreDTO, ExerciseUpdateDTO } from './dto/exercise.dto';
import { ExerciseDeleteRO, ExerciseGetDetailRO, ExerciseGetListRO, ExerciseStoreRO, ExerciseUpdateRO } from './ro/exercise.ro';
import { ExerciseEntity } from './exercise.entity';
import { SectionExerciseEntity } from '../section-exercise/section-exercise.entity';
import { SectionRepository } from '../section/section.repository';

@Injectable()
export class ExerciseService extends BaseService {
  private readonly logger = new Logger(ExerciseService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly sectionRepository: SectionRepository,
    private readonly sectionExerciseRepository: SectionExerciseRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: ExerciseStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    let response: ExerciseStoreRO;

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Store exercise
        const exerciseData = new ExerciseEntity({
          name: dto.name,
          difficultyId: dto.difficultyId,
          createdBy: actorId,
        });
        const exercise = await this.exerciseRepository.insertWithTransaction(transaction, exerciseData);

        // Store section exercise
        let sectionExercise: Partial<SectionExerciseEntity>;
        if (dto.sectionId) {
          const sectionExerciseData = new SectionExerciseEntity({
            sectionId: dto.sectionId,
            exerciseId: exercise.id,
            createdBy: actorId,
          });
          sectionExercise = await this.sectionExerciseRepository.insertWithTransaction(transaction, sectionExerciseData);
        }

        response = new ExerciseStoreRO({
          id: exercise.id,
          name: exercise.name,
          difficultyId: exercise.difficultyId,
          sectionId: sectionExercise?.sectionId,
        });
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseStoreRO,
      response,
      message: 'Exercise created successfully',
      actorId,
    });
  }

  async getList(dto: ExerciseGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.exerciseRepository.find(dto);
      return this.success({
        classRO: ExerciseGetListRO,
        response,
        message: 'Get exercise list successfully',
        actorId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let response: any;

    try {
      response = await this.exerciseRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!response) {
      const { code, status, message } = EXCEPTION.EXERCISE.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseGetDetailRO,
      response,
      message: 'Get exercise detail successfully',
      actorId,
    });
  }

  async update(id: number, dto: ExerciseUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, actorId);
    const response = new ExerciseUpdateRO();

    try {
      const exerciseData = new ExerciseEntity();

      if (dto.name) {
        exerciseData.name = dto.name;
      }

      const exercise = await this.exerciseRepository.update(id, exerciseData);

      response.id = exercise.id;
      response.name = exercise.name;
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseUpdateRO,
      response,
      message: 'Exercise updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    const response = new ExerciseDeleteRO();

    try {
      const exercise = await this.exerciseRepository.delete(id, actorId);

      response.id = exercise.id;
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseDeleteRO,
      response,
      message: 'Exercise deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: ExerciseStoreDTO, actorId: number) {
    // Check section exist
    if (dto.sectionId) {
      const sectionCount = await this.sectionRepository.countById(dto.sectionId);
      if (!sectionCount) {
        const { code, status, message } = EXCEPTION.SECTION.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check exist
    const exerciseCount = await this.exerciseRepository.countById(id);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const exerciseCount = await this.exerciseRepository.countById(id);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
