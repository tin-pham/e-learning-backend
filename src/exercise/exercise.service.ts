import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { LessonExerciseEntity } from '../lesson-exercise/lesson-exercise.entity';
import { ExerciseRepository } from './exercise.repository';
import { LessonRepository } from '../lesson/lesson.repository';
import { LessonExerciseRepository } from '../lesson-exercise/lesson-exercise.repository';
import { ExerciseQuestionRepository } from '../exercise-question/exercise-question.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseGetListDTO, ExerciseStoreDTO, ExerciseUpdateDTO } from './dto/exercise.dto';
import { ExerciseDeleteRO, ExerciseGetDetailRO, ExerciseGetListRO, ExerciseStoreRO, ExerciseUpdateRO } from './ro/exercise.ro';
import { ExerciseEntity } from './exercise.entity';
import { ExerciseQuestionSnapshotRepository } from 'src/exercise-question-snapshot/exercise-question-snapshot.repository';

@Injectable()
export class ExerciseService extends BaseService {
  private readonly logger = new Logger(ExerciseService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly lessonExerciseRepository: LessonExerciseRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly exerciseQuestionRepository: ExerciseQuestionRepository,
    private readonly exerciseQuestionSnapshotRepository: ExerciseQuestionSnapshotRepository,
    private readonly questionOptionRepository: QuestionOptionRepository,
    private readonly exerciseQuestionOptionSnapshotRepository: ExerciseQuestionOptionSnapshotRepository,
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
        const exerciseData = new ExerciseEntity();
        exerciseData.name = dto.name;
        exerciseData.difficultyId = dto.difficultyId;
        exerciseData.createdBy = actorId;
        exerciseData.dueDate = dto.dueDate;
        exerciseData.time = dto.time;
        const exercise = await this.exerciseRepository.insertWithTransaction(transaction, exerciseData);

        // Store lesson exercise
        let lessonExercise: Partial<LessonExerciseEntity>;
        if (dto.lessonId) {
          const lessonExerciseData = new LessonExerciseEntity({
            lessonId: dto.lessonId,
            exerciseId: exercise.id,
            createdBy: actorId,
          });
          lessonExercise = await this.lessonExerciseRepository.insertWithTransaction(transaction, lessonExerciseData);
        }

        response = new ExerciseStoreRO({
          id: exercise.id,
          name: exercise.name,
          difficultyId: exercise.difficultyId,
          lessonId: lessonExercise?.lessonId,
          time: exercise.time,
          dueDate: exercise.dueDate,
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

      if (dto.time) {
        exerciseData.time = dto.time;
      }

      if (dto.dueDate) {
        exerciseData.dueDate = dto.dueDate;
      }

      if (dto.isActive) {
        exerciseData.isActive = dto.isActive;
        exerciseData.activatedAt = new Date();
      }

      await this.database.transaction().execute(async (transaction) => {
        // Update exercise
        const exercise = await this.exerciseRepository.updateWithTransaction(transaction, id, exerciseData);

        // Create an exercise snapshot
        if (exercise.isActive) {
          // Question snapshot
          const questions = await this.exerciseQuestionRepository.getQuestionIdsByExerciseId(exercise.id);
          const questionIds = questions.map((question) => question.questionId);
          if (questionIds.length > 0) {
            await this.exerciseQuestionSnapshotRepository.insertMultipleByQuestionIdsWithTransaction(transaction, questionIds, exercise.id);

            // Question option snapshot
            const options = await this.questionOptionRepository.getIdsByQuestionIds(questionIds);
            const optionIds = options.map((option) => option.id);

            if (optionIds.length > 0) {
              await this.exerciseQuestionOptionSnapshotRepository.insertMultipleByOptionIdsWithTransaction(transaction, optionIds);
            }
          }
        }

        response.id = exercise.id;
        response.name = exercise.name;
        response.isActive = exercise.isActive;
        response.activatedAt = exercise.activatedAt;
        response.dueDate = exercise.dueDate;
        response.time = exercise.time;
      });
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
      await this.database.transaction().execute(async (transaction) => {
        // Delete exercise
        const exercise = await this.exerciseRepository.deleteWithTransaction(transaction, id, actorId);

        // Delete question snapshot
        await this.exerciseQuestionSnapshotRepository.deleteByExerciseIdWithTransaction(transaction, exercise.id);
        // Delete option snapshot
        await this.exerciseQuestionOptionSnapshotRepository.deleteByExerciseIdWithTransaction(transaction, exercise.id);

        response.id = exercise.id;
      });
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
    // Check lesson exist
    if (dto.lessonId) {
      const lessonCount = await this.lessonRepository.countById(dto.lessonId);
      if (!lessonCount) {
        const { code, status, message } = EXCEPTION.LESSON.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check exist
    const exercise = await this.exerciseRepository.findOneById(id);
    if (!exercise) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // If active => can't update
    if (exercise.isActive) {
      const { code, status, message } = EXCEPTION.EXERCISE.CANNOT_UPDATE_ACTIVATED_EXERCISE;
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
