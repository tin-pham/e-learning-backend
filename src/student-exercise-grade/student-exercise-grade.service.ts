import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService, Transaction } from '../database';
import { NotificationGateway } from '../socket/notification.gateway';
import { StudentExerciseGradeEntity } from './student-exercise-grade.entity';
import { UserNotificationEntity } from '../user-notification/user-notification.entity';
import { NotificationEntity } from '../notification/notification.entity';
import { StudentExerciseNotificationEntity } from '../student-exercise-notification/student-exercise-notification.entity';
import { StudentExerciseGradeRepository } from './student-exercise-grade.repository';
import { StudentExerciseRepository } from '../student-exercise/student-exercise.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { StudentExerciseOptionRepository } from '../student-exercise-option/student-exercise-option.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { StudentRepository } from '../student/student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { StudentExerciseNotificationRepository } from '../student-exercise-notification/student-exercise-notification.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import {
  StudentExerciseGradeBulkCalculateDTO,
  StudentExerciseGradeCalculateDTO,
  StudentExerciseGradeDeleteAllDTO,
} from './dto/student-exercise-grade.dto';
import { StudentExerciseGradeCalculateRO, StudentExerciseGradeDeleteRO } from './ro/student-exercise-grade.ro';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class StudentExerciseGradeService extends BaseService {
  private readonly logger = new Logger(StudentExerciseGradeService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly notificationGateway: NotificationGateway,
    private readonly studentExerciseGradeRepository: StudentExerciseGradeRepository,
    private readonly studentExerciseRepository: StudentExerciseRepository,
    private readonly exerciseQuestionSnapshotRepository: ExerciseQuestionSnapshotRepository,
    private readonly exerciseQuestionOptionSnapshotRepository: ExerciseQuestionOptionSnapshotRepository,
    private readonly studentExerciseOptionRepository: StudentExerciseOptionRepository,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly studentRepository: StudentRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly studentExerciseNotificationRepository: StudentExerciseNotificationRepository,
  ) {
    super(elasticLogger);
  }

  async calculate(dto: StudentExerciseGradeCalculateDTO, decoded: IJwtPayload, transaction?: Transaction) {
    const actorId = decoded.userId;
    const { studentExercise, questionSnapshotIds } = await this.validateCalculate(dto, actorId);
    let response: StudentExerciseGradeCalculateRO;

    try {
      const studentExerciseGradeData = new StudentExerciseGradeEntity();
      studentExerciseGradeData.correctCount = 0;
      studentExerciseGradeData.studentExerciseId = studentExercise.id;
      studentExerciseGradeData.totalCount = questionSnapshotIds.length;

      for (const questionId of questionSnapshotIds) {
        // Get correct question option
        const correctQuestionOptions = await this.exerciseQuestionOptionSnapshotRepository.getCorrectIdByQuestionSnapshotId(questionId);
        console.log(correctQuestionOptions);
        const correctQuestionOptionIds = correctQuestionOptions.map((option) => option.id);

        // Get student exercise option (snapshot)
        const studentExerciseOptions = await this.studentExerciseOptionRepository.getQuestionOptionByStudentExerciseIdAndQuestionId(
          studentExercise.id,
          questionId,
        );
        console.log(studentExerciseOptions);
        const studentExerciseOptionIds = studentExerciseOptions.map((option) => option.questionOptionSnapshotId);

        // Compare
        if (correctQuestionOptionIds.every((optionId) => studentExerciseOptionIds.includes(optionId))) {
          studentExerciseGradeData.correctCount += 1;
        }
      }

      studentExerciseGradeData.point = (studentExerciseGradeData.correctCount / studentExerciseGradeData.totalCount) * dto.basePoint;
      studentExerciseGradeData.basePoint = dto.basePoint;

      let studentExerciseGrade = null;
      if (transaction) {
        studentExerciseGrade = await this.studentExerciseGradeRepository.insertWithTransaciton(transaction, studentExerciseGradeData);
      } else {
        studentExerciseGrade = await this.studentExerciseGradeRepository.insert(studentExerciseGradeData);
      }

      response = new StudentExerciseGradeCalculateRO({
        id: studentExerciseGrade.id,
        point: studentExerciseGrade.point,
        correctCount: studentExerciseGrade.correctCount,
        totalCount: studentExerciseGrade.totalCount,
        studentExerciseId: studentExerciseGrade.studentExerciseId,
        basePoint: dto.basePoint,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE_GRADE.CALCULATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: StudentExerciseGradeCalculateRO,
      response,
      message: 'Calculate success',
      actorId,
    });
  }

  async bulkCalculate(dto: StudentExerciseGradeBulkCalculateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { studentExercises, exercise } = await this.validateBulkCalculate(dto, decoded.userId);

    if (!studentExercises.length) {
      return this.success({
        classRO: ResultRO,
        response: { result: true },
        message: 'Calculate all student exercise grade success',
        actorId,
      });
    }

    try {
      await this.database.transaction().execute(async (transaction) => {
        for (const studentExercise of studentExercises) {
          // Delete old grade if exist
          if (studentExercise.studentExerciseGradeId) {
            await this.studentExerciseGradeRepository.deleteWithTransaction(transaction, studentExercise.studentExerciseGradeId);
          }

          await this.calculate(
            {
              studentExerciseId: studentExercise.id,
              basePoint: dto.basePoint,
            },
            decoded,
            transaction,
          );
        }

        // // Store notification
        const notificationData = new NotificationEntity({
          title: 'ĐÃ CHẤM ĐIỂM',
          content: `Bài tập ${exercise.name} đã được chấm điểm`,
        });
        const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

        const studentExerciseNotificationData = studentExercises.map(
          (studentExercise) =>
            new StudentExerciseNotificationEntity({ studentExerciseId: studentExercise.id, notificationId: notification.id }),
        );
        await this.studentExerciseNotificationRepository.insertMultipleWithTransaction(transaction, studentExerciseNotificationData);

        // Notify student exercise
        let users: { id: number }[] = [];
        const studentIds = studentExercises.map((studentExercise) => studentExercise.studentId);
        users = await this.studentRepository.getUserIdsByStudentIds(studentIds);

        const userNotificationData = users.map(
          (user) =>
            new UserNotificationEntity({
              userId: user.id,
              notificationId: notification.id,
            }),
        );

        this.notificationGateway.sendNotification();

        await this.userNotificationRepository.insertMultipleWithTransaction(transaction, userNotificationData);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE_GRADE.BULK_CALCULATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Bulk calculate success',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    let response: StudentExerciseGradeDeleteRO;

    try {
      const studentExerciseGrade = await this.studentExerciseGradeRepository.deleteById(id, actorId);

      response = new StudentExerciseGradeDeleteRO({
        id: studentExerciseGrade.id,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE_GRADE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: StudentExerciseGradeDeleteRO,
      response,
      message: 'Delete success',
      actorId,
    });
  }

  async deleteAll(dto: StudentExerciseGradeDeleteAllDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { studentExerciseGradeCount } = await this.validateDeleteAll(dto, actorId);

    try {
      if (!studentExerciseGradeCount) {
        return this.success({
          classRO: ResultRO,
          response: { result: true },
          message: 'Delete all student exercise grade success',
          actorId,
        });
      }
      await this.studentExerciseGradeRepository.deleteByExerciseId(dto.exerciseId, actorId);
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE_GRADE.DELETE_ALL_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Delete all student exercise grade success',
      actorId,
    });
  }

  private async validateCalculate(dto: StudentExerciseGradeCalculateDTO, actorId: number) {
    // Check unique
    // const studentExerciseGradeCount = await this.studentExerciseGradeRepository.countByStudentExerciseId(dto.studentExerciseId);
    // if (studentExerciseGradeCount) {
    //   const { code, status, message } = EXCEPTION.STUDENT_EXERCISE_GRADE.ALREADY_EXIST;
    //   this.throwException({ code, status, message, actorId });
    // }

    // Check student exercise exist and submitted
    const studentExercise = await this.studentExerciseRepository.findOneById(dto.studentExerciseId);
    if (!studentExercise) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    if (!studentExercise.isSubmitted) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.NOT_SUBMITTED;
      this.throwException({ code, status, message, actorId });
    }

    // Get question ids by exercise id
    const questionSnapshots = await this.exerciseQuestionSnapshotRepository.getIdsByExerciseId(studentExercise.exerciseId);
    console.log(questionSnapshots);

    if (!questionSnapshots.length) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION_SNAPSHOT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
    const questionSnapshotIds = questionSnapshots.map((question) => question.id);

    return { studentExercise, questionSnapshotIds };
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const studentExerciseGradeCount = await this.studentExerciseGradeRepository.countById(id);
    if (!studentExerciseGradeCount) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE_GRADE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateBulkCalculate(dto: StudentExerciseGradeBulkCalculateDTO, actorId: number) {
    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countById(dto.exerciseId);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Get student exercise list
    const studentExercises = await this.studentExerciseRepository.findByExerciseId(dto.exerciseId);

    // Get exercise
    const exercise = await this.exerciseRepository.getNameById(dto.exerciseId);
    if (!exercise) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return {
      studentExercises,
      exercise,
    };
  }

  private async validateDeleteAll(dto: StudentExerciseGradeDeleteAllDTO, actorId: number) {
    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countById(dto.exerciseId);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check student exercise grade exist
    const studentExerciseGradeCount = await this.studentExerciseGradeRepository.countByExerciseId(dto.exerciseId);

    return {
      studentExerciseGradeCount,
    };
  }
}
