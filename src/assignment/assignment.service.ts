import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { AssignmentEntity } from './assignment.entity';
import { AssignmentAttachmentRepository } from '../assignment-attachment/assignment-attachment.repository';
import { AssignmentRepository } from './assignment.repository';
import { AssignmentExerciseRepository } from '../assignment-exercise/assignment-exercise.repository';
import { CourseRepository } from '../course/course.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { AssignmentGetListDTO, AssignmentStoreDTO, AssignmentUpdateDTO } from './dto/assignment.dto';
import { AssignmentDeleteRO, AssignmentGetDetailRO, AssignmentGetListRO, AssignmentStoreRO, AssignmentUpdateRO } from './ro/assignment.ro';
import { sql } from 'kysely';

@Injectable()
export class AssignmentService extends BaseService {
  private readonly logger = new Logger(AssignmentService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly courseRepository: CourseRepository,
    private readonly assignmentRepository: AssignmentRepository,
    private readonly assignmentAttachmentRepository: AssignmentAttachmentRepository,
    private readonly assignmentExerciseRepository: AssignmentExerciseRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: AssignmentStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    let response: AssignmentStoreRO;
    try {
      await this.database.transaction().execute(async (transaction) => {
        await transaction.executeQuery(sql`SET CONSTRAINTS ALL DEFERRED;`.compile(transaction));
        const assignmentData = new AssignmentEntity({
          name: dto.name,
          description: dto.description,
          dueDate: dto.dueDate,
          courseId: dto.courseId,
          createdBy: actorId,
        });

        const assignment = await this.assignmentRepository.insertWithTransaction(transaction, assignmentData);

        if (dto.urls) {
          await this.assignmentAttachmentRepository.insertMultipleByUrlsWithTransaction(transaction, {
            urls: dto.urls,
            assignmentId: assignment.id,
            actorId: actorId,
          });
        }

        if (dto.exerciseIds) {
          await this.assignmentExerciseRepository.insertMultipleByExerciseIdsWithTransaction(transaction, {
            exerciseIds: dto.exerciseIds,
            assignmentId: assignment.id,
            actorId: actorId,
          });
        }

        response = new AssignmentStoreRO({
          id: assignment.id,
          name: assignment.name,
          description: assignment.description,
          dueDate: assignment.dueDate,
        });
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentStoreRO,
      response,
      message: 'Assignment stored successfully',
      actorId,
    });
  }

  async getList(dto: AssignmentGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.assignmentRepository.find(dto);

      return this.success({
        classRO: AssignmentGetListRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async getDetail(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    let assignment: AssignmentEntity;

    try {
      assignment = await this.assignmentRepository.findOneById(id);
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.GET_DETAIL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    if (!assignment) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.NOT_FOUND;
      this.throwException({ code, status, message, actorId });
    }

    const response = new AssignmentGetDetailRO({
      id: assignment.id,
      name: assignment.name,
      description: assignment.description,
      dueDate: assignment.dueDate,
    });

    return this.success({
      classRO: AssignmentGetDetailRO,
      response,
    });
  }

  async update(id: number, dto: AssignmentUpdateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateUpdate(id, actorId);

    let response: AssignmentUpdateRO;

    try {
      const assignmentData = new AssignmentEntity({
        name: dto.name,
        description: dto.description,
        dueDate: dto.dueDate,
        courseId: dto.courseId,
        updatedAt: new Date(),
        updatedBy: actorId,
      });

      const assignment = await this.assignmentRepository.update(id, assignmentData);

      response = new AssignmentUpdateRO({
        id: assignment.id,
        name: assignment.name,
        description: assignment.description,
        dueDate: assignment.dueDate,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.UPDATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentUpdateRO,
      response,
      message: 'Assignment updated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    let response: AssignmentDeleteRO;

    try {
      const assignment = await this.assignmentRepository.delete(id, actorId);

      response = new AssignmentDeleteRO({
        id: assignment.id,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: AssignmentDeleteRO,
      response,
      message: 'Assignment deleted successfully',
      actorId,
    });
  }

  private async validateStore(dto: AssignmentStoreDTO, actorId: number) {
    // Check course exist
    const courseCount = await this.courseRepository.countById(dto.courseId);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateUpdate(id: number, actorId: number) {
    // Check exist
    const assignmentCount = await this.assignmentRepository.countById(id);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check course exist
    const courseCount = await this.courseRepository.countById(id);
    if (!courseCount) {
      const { code, status, message } = EXCEPTION.COURSE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const assignmentCount = await this.assignmentRepository.countById(id);
    if (!assignmentCount) {
      const { code, status, message } = EXCEPTION.ASSIGNMENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
