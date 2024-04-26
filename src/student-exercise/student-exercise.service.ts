import { Injectable, Logger } from '@nestjs/common';
import { SchedulerRegistry } from '@nestjs/schedule';
import { CronJob } from 'cron';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService, Transaction } from '../database';
import { StudentExerciseGradeEntity } from '../student-exercise-grade/student-exercise-grade.entity';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { StudentRepository } from '../student/student.repository';
import { StudentExerciseRepository } from './student-exercise.repository';
import { StudentExerciseOptionRepository } from '../student-exercise-option/student-exercise-option.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { StudentExerciseGradeRepository } from '../student-exercise-grade/student-exercise-grade.repository';
import { StudentExerciseNotificationRepository } from '../student-exercise-notification/student-exercise-notification.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import {
  StudentExerciseBulkDeleteDTO,
  StudentExerciseGetListSubmittedDTO,
  StudentExerciseStoreDTO,
  StudentExerciseSubmitDTO,
} from './dto/student-exercise.dto';
import { StudentExerciseEntity } from './student-exercise.entity';
import { ResultRO } from '../common/ro/result.ro';
import { StudentExerciseGetListSubmittedRO, StudentExerciseStoreRO } from './ro/student-exercise.ro';

@Injectable()
export class StudentExerciseService extends BaseService {
  private readonly logger = new Logger(StudentExerciseService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly schedulerRegistry: SchedulerRegistry,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly studentRepository: StudentRepository,
    private readonly studentExerciseRepository: StudentExerciseRepository,
    private readonly exerciseQuestionSnapshotRepository: ExerciseQuestionSnapshotRepository,
    private readonly exerciseQuestionOptionSnapshotRepository: ExerciseQuestionOptionSnapshotRepository,
    private readonly studentExerciseOptionRepository: StudentExerciseOptionRepository,
    private readonly studentExerciseGradeRepository: StudentExerciseGradeRepository,
    private readonly studentExerciseNotificationRepository: StudentExerciseNotificationRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: StudentExerciseStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { student, exercise } = await this.validateStore(dto, actorId);

    const response = new StudentExerciseStoreRO();

    try {
      const studentExerciseData = new StudentExerciseEntity();
      studentExerciseData.exerciseId = dto.exerciseId;
      studentExerciseData.studentId = student.id;
      studentExerciseData.createdBy = actorId;

      let studentExercise: any;
      await this.database.transaction().execute(async (transaction) => {
        studentExercise = await this.studentExerciseRepository.insertWithTransaction(transaction, studentExerciseData);

        this.scheduleExerciseSubmission(studentExercise.id, exercise.time, decoded);
      });

      response.id = studentExercise.id;
      response.startDoingAt = studentExercise.startDoingAt;
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: StudentExerciseStoreRO,
      response,
      message: 'Store student exercise successfully',
      actorId,
    });
  }

  async submit(id: number, dto: StudentExerciseSubmitDTO, decoded: IJwtPayload, trx?: Transaction) {
    const actorId = decoded.userId;
    const { studentExercise } = await this.validateSubmit(id, dto, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Stop cron job if it not run through by another service (cron job)
        if (!trx) {
          this.stopScheduleExerciseSubmission(id);
        }

        const studentExerciseData = new StudentExerciseEntity();
        studentExerciseData.updatedBy = actorId;
        studentExerciseData.updatedAt = new Date();
        studentExerciseData.isSubmitted = true;
        studentExerciseData.submittedAt = new Date();
        // Is late
        if (studentExercise.exerciseDueDate < studentExerciseData.submittedAt) {
          studentExerciseData.isLate = true;
        }

        await this.studentExerciseRepository.updateWithTransaction(trx || transaction, id, studentExerciseData);

        for (const questionSnapshot of dto.snapshotQuestions) {
          if (questionSnapshot.snapshotOptionIds.length) {
            await this.studentExerciseOptionRepository.insertMultipleQuestionOptionIdsWithTransaction({
              questionSnapshotId: questionSnapshot.id,
              questionOptionSnapshotIds: questionSnapshot.snapshotOptionIds,
              studentExerciseId: id,
              transaction: trx || transaction,
              createdBy: actorId,
            });
          }
        }

        // Auto mark if it intant mark
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.SUBMIT_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
    });
  }

  async getListSubmitted(dto: StudentExerciseGetListSubmittedDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const studentExercises = await this.studentExerciseRepository.find(dto);
      console.log(studentExercises);

      return this.success({
        classRO: StudentExerciseGetListSubmittedRO,
        response: studentExercises,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.GET_SUBMITTED_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Delete notificaiton
        await this.studentExerciseNotificationRepository.deleteByStudentExerciseIdWithTransaction(transaction, id);

        // Delete student exercise grade
        await this.studentExerciseGradeRepository.deleteByStudentExerciseIdWithTransaction(transaction, id);

        // Delete student exercise option
        await this.studentExerciseOptionRepository.deleteByStudentExerciseIdWithTransaction(transaction, id);

        // Delete student exercise
        await this.studentExerciseRepository.deleteWithTransaction(transaction, id);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Delete exercise student successfully',
      actorId,
    });
  }

  async bulkDelete(dto: StudentExerciseBulkDeleteDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateBulkDelete(dto, actorId);

    try {
      await this.studentExerciseRepository.deleteByExerciseId(dto.exerciseId, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.BULK_DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateStore(dto: StudentExerciseStoreDTO, actorId: number) {
    // Check exercise exist and active
    const exercise = await this.exerciseRepository.findOneById(dto.exerciseId);
    if (!exercise) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
    if (!exercise.isActive) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.CANNOT_START_INACTIVE_EXERCISE;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exist
    const student = await this.studentRepository.getStudentIdByUserId(actorId);
    if (!student) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check exist
    const studentExerciseCount = await this.studentExerciseRepository.countByStudentIdAndExerciseId(student.id, dto.exerciseId);
    if (studentExerciseCount) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return { student, exercise };
  }
  private scheduleExerciseSubmission(studentExerciseId: number, duration: number, decoded: IJwtPayload) {
    const jobName = `submit-exercise-${studentExerciseId}`;
    const job = new CronJob(new Date(Date.now() + duration * 61000), async () => {
      await this.submit(studentExerciseId, { snapshotQuestions: [] }, decoded);

      // Check if exercise is instant grade => 0 since don't have any options
      const exercise = await this.exerciseRepository.getInstantMarkByStudentExerciseId(studentExerciseId);

      if (!exercise) {
        const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId: decoded.userId });
      }

      if (exercise.instantMark) {
        const studentExerciseGradeData = new StudentExerciseGradeEntity();
        studentExerciseGradeData.basePoint = 100;
        studentExerciseGradeData.createdBy = decoded.userId;
        studentExerciseGradeData.studentExerciseId = studentExerciseId;
        studentExerciseGradeData.correctCount = 0;
        studentExerciseGradeData.totalCount = 0;
        studentExerciseGradeData.point = 0;

        await this.studentExerciseGradeRepository.insert(studentExerciseGradeData);
      }
    });

    this.schedulerRegistry.addCronJob(jobName, job);
    job.start();
    this.logger.log(`Scheduled auto submission for Exercise ID ${studentExerciseId} in ${duration} minutes.`);
  }

  private async stopScheduleExerciseSubmission(studentExerciseId: number) {
    const jobName = `submit-exercise-${studentExerciseId}`;
    const job = this.schedulerRegistry.doesExist('cron', jobName) ? this.schedulerRegistry.getCronJob(jobName) : null;
    if (job) {
      job.stop();
    }

    this.logger.log(`Stop auto submission for Exercise ID ${studentExerciseId}.`);
  }

  private async validateSubmit(id: number, dto: StudentExerciseSubmitDTO, actorId: number) {
    // Get student exercise by id
    const studentExercise = await this.studentExerciseRepository.findOneById(id);
    if (!studentExercise) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check already submitted
    if (studentExercise.isSubmitted) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.ALREADY_SUBMITTED;
      this.throwException({ code, status, message, actorId });
    }

    // Check question exist
    const snapshotQuestionIds = [];
    const snapshotOptionIds = [];
    for (const question of dto.snapshotQuestions) {
      snapshotQuestionIds.push(question.id);
      snapshotOptionIds.push(...question.snapshotOptionIds);
    }

    if (snapshotQuestionIds.length) {
      const exerciseQuestionSnapshotCount = await this.exerciseQuestionSnapshotRepository.countByIds(snapshotQuestionIds);
      if (!exerciseQuestionSnapshotCount) {
        const { code, status, message } = EXCEPTION.EXERCISE_QUESTION_SNAPSHOT.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    if (snapshotOptionIds.length) {
      const exerciseQuestionOptionSnapshotCount = await this.exerciseQuestionOptionSnapshotRepository.countByIds(snapshotOptionIds);
      if (!exerciseQuestionOptionSnapshotCount) {
        const { code, status, message } = EXCEPTION.EXERCISE_QUESTION_OPTION_SNAPSHOT.DOES_NOT_EXIST;
        this.throwException({ code, status, message, actorId });
      }
    }

    return { studentExercise };
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const studentExerciseCount = await this.studentExerciseRepository.countById(id);
    if (!studentExerciseCount) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkDelete(dto: StudentExerciseBulkDeleteDTO, actorId: number) {
    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countById(dto.exerciseId);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
