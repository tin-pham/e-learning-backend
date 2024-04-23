import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { NotificationGateway } from '../socket/notification.gateway';
import { NotificationEntity } from '../notification/notification.entity';
import { LessonExerciseEntity } from '../lesson-exercise/lesson-exercise.entity';
import { ExerciseEntity } from './exercise.entity';
import { UserNotificationEntity } from '../user-notification/user-notification.entity';
import { LessonRepository } from '../lesson/lesson.repository';
import { LessonExerciseRepository } from '../lesson-exercise/lesson-exercise.repository';
import { ExerciseQuestionRepository } from '../exercise-question/exercise-question.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { QuestionOptionRepository } from '../question-option/question-option.repository';
import { NotificationRepository } from '../notification/notification.repository';
import { CourseStudentRepository } from '../course-student/course-student.repository';
import { UserNotificationRepository } from '../user-notification/user-notification.repository';
import { CourseNotificationRepository } from '../course-notification/course-notification.repository';
import { ExerciseNotificationRepository } from '../exercise-notification/exercise-notification.repository';
import { StudentRepository } from '../student/student.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { StudentExerciseOptionRepository } from '../student-exercise-option/student-exercise-option.repository';
import { ExerciseRepository } from './exercise.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseGetDetailDTO, ExerciseGetListDTO, ExerciseStoreDTO, ExerciseUpdateDTO } from './dto/exercise.dto';
import { ExerciseGetDetailRO, ExerciseGetListRO, ExerciseStoreRO, ExerciseUpdateRO } from './ro/exercise.ro';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class ExerciseService extends BaseService {
  private readonly logger = new Logger(ExerciseService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly notificationGateway: NotificationGateway,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly lessonExerciseRepository: LessonExerciseRepository,
    private readonly lessonRepository: LessonRepository,
    private readonly exerciseQuestionRepository: ExerciseQuestionRepository,
    private readonly exerciseQuestionSnapshotRepository: ExerciseQuestionSnapshotRepository,
    private readonly questionOptionRepository: QuestionOptionRepository,
    private readonly exerciseQuestionOptionSnapshotRepository: ExerciseQuestionOptionSnapshotRepository,
    private readonly notificationRepository: NotificationRepository,
    private readonly userNotificationRepository: UserNotificationRepository,
    private readonly courseNotificationRepository: CourseNotificationRepository,
    private readonly exerciseNotificationRepository: ExerciseNotificationRepository,
    private readonly courseStudentRepository: CourseStudentRepository,
    private readonly studentRepository: StudentRepository,
    private readonly studentExerciseOptionRepository: StudentExerciseOptionRepository,
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
        exerciseData.instantMark = dto.instantMark;
        exerciseData.allowRedo = dto.allowRedo;
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
          instantMark: exercise.instantMark,
          allowRedo: exercise.allowRedo,
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
      const response = await this.exerciseRepository.find(dto, actorId);
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

  async getDetail(id: number, dto: ExerciseGetDetailDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    let response: any;

    try {
      response = await this.exerciseRepository.findOneById(id, dto, actorId);
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

      if (dto.instantMark) {
        exerciseData.instantMark = dto.instantMark;
      }

      if (dto.allowRedo) {
        exerciseData.allowRedo = dto.allowRedo;
      }

      if (dto.difficultyId) {
        exerciseData.difficultyId = dto.difficultyId;
      }

      await this.database.transaction().execute(async (transaction) => {
        // Update exercise
        const exercise = await this.exerciseRepository.updateWithTransaction(transaction, id, exerciseData);

        response.id = exercise.id;
        response.name = exercise.name;
        response.isActive = exercise.isActive;
        response.activatedAt = exercise.activatedAt;
        response.dueDate = exercise.dueDate;
        response.time = exercise.time;
        response.instantMark = exercise.instantMark;
        response.allowRedo = exercise.allowRedo;
        response.difficultyId = exercise.difficultyId;
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

  async activate(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { lesson } = await this.validateActivate(id, actorId);

    try {
      const exerciseData = new ExerciseEntity();
      exerciseData.isActive = true;
      exerciseData.activatedAt = new Date();

      await this.database.transaction().execute(async (transaction) => {
        // Update exercise
        const exercise = await this.exerciseRepository.updateWithTransaction(transaction, id, exerciseData);

        // Question snapshot
        const questions = await this.exerciseQuestionRepository.getQuestionIdsByExerciseId(exercise.id);
        const questionIds = questions.map((question) => question.questionId);

        if (questionIds.length > 0) {
          await this.exerciseQuestionSnapshotRepository.insertMultipleByQuestionIdsAndExerciseIdWithTransaction(
            transaction,
            questionIds,
            exercise.id,
          );

          // Question option snapshot
          const options = await this.questionOptionRepository.getIdsByQuestionIds(questionIds);
          const optionIds = options.map((option) => option.id);

          if (optionIds.length > 0) {
            await this.exerciseQuestionOptionSnapshotRepository.insertMultipleByOptionIdsAndExerciseIdWithTransaction(
              transaction,
              optionIds,
              exercise.id,
            );
          }
        }

        // Store notification
        const notificationData = new NotificationEntity({
          title: 'BÀI TẬP MỚI',
          content: `${lesson.courseName} đã tạo bài tập mới: ${exercise.name}`,
        });
        const notification = await this.notificationRepository.insertWithTransaction(transaction, notificationData);

        // Notify for who inside the course
        await this.courseNotificationRepository.insertWithTransaction(transaction, {
          courseId: lesson.courseId,
          notificationId: notification.id,
        });

        // Keep exercise id for direction
        await this.exerciseNotificationRepository.insertWithTransaction(transaction, {
          exerciseId: exercise.id,
          notificationId: notification.id,
        });

        // Keep is read for each user
        const courseStudents = await this.courseStudentRepository.getStudentIdsByCourseId(lesson.courseId);

        let users: { id: number }[] = [];
        if (courseStudents.length) {
          const studentIds = courseStudents.map((courseStudent) => courseStudent.studentId);
          users = await this.studentRepository.getUserIdsByStudentIds(studentIds);

          const userNotificationData = users.map(
            (user) =>
              new UserNotificationEntity({
                userId: user.id,
                notificationId: notification.id,
              }),
          );
          await this.userNotificationRepository.insertMultipleWithTransaction(transaction, userNotificationData);
        }

        this.notificationGateway.sendNotification();
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE.ACTIVATE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Exercise activated successfully',
      actorId,
    });
  }

  async delete(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateDelete(id, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Delete exercise
        const exercise = await this.exerciseRepository.deleteWithTransaction(transaction, id, actorId);

        // Delete question snapshot
        await this.exerciseQuestionSnapshotRepository.deleteByExerciseIdWithTransaction(transaction, exercise.id, actorId);
        // Delete option snapshot
        await this.exerciseQuestionOptionSnapshotRepository.deleteByExerciseIdWithTransaction(transaction, exercise.id, actorId);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE.DELETE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Exercise deleted successfully',
      actorId,
    });
  }

  async sync(id: number, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateSync(id, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        // Get current question belong to this exercise
        const exerciseQuestions = await this.exerciseQuestionRepository.findQuestionsByExerciseId(id);

        // Get deleted exercise question
        const deletedExerciseQuestions = await this.exerciseQuestionRepository.findDeletedByExerciseId(id);

        // Delete snapshot of deleted exercise question
        if (deletedExerciseQuestions.length) {
          const exerciseQuestionsSnapshot = await this.exerciseQuestionSnapshotRepository.deleteByQuestionIdsWithTransaction(
            transaction,
            deletedExerciseQuestions.map((question) => question.questionId),
          );

          // Delete options of these snapshot question
          const questionOptionSnapshots =
            await this.exerciseQuestionOptionSnapshotRepository.deleteByExerciseQuestionSnapshotIdsWithTransaction(
              transaction,
              exerciseQuestionsSnapshot.map((questionSnapshot) => questionSnapshot.id),
            );

          // Delete student options
          const questionoptionSnapshotIds = questionOptionSnapshots.map((questionOptionSnapshot) => questionOptionSnapshot.id);
          await this.studentExerciseOptionRepository.deleteByExerciseQuestionSnapshotIdsWithTransaction(
            transaction,
            questionoptionSnapshotIds,
          );
        }

        // Update the current question in exercise
        for (const exerciseQuestion of exerciseQuestions) {
          // Update if question is exist
          let questionSnapshot = await this.exerciseQuestionSnapshotRepository.getIdByQuestionIdAndExerciseId(
            exerciseQuestion.questionId,
            id,
          );
          const questionSnapshotData = {
            text: exerciseQuestion.questionText,
            capturedAt: new Date(),
            exerciseId: id,
            questionId: exerciseQuestion.questionId,
            difficultyId: exerciseQuestion.questionDifficultyId,
            isMultipleChoice: exerciseQuestion.questionIsMultipleChoice,
          };
          if (questionSnapshot) {
            await this.exerciseQuestionSnapshotRepository.updateWithTransaction(transaction, questionSnapshot.id, {
              ...questionSnapshotData,
              updatedBy: actorId,
              updatedAt: new Date(),
            });
          } else {
            // Insert new question snapshot with new question
            questionSnapshot = await this.exerciseQuestionSnapshotRepository.insertWithTransaction(transaction, {
              ...questionSnapshotData,
              createdBy: actorId,
              createdAt: new Date(),
            });
          }

          // Get options belong to question
          const options = await this.questionOptionRepository.findByQuestionId(exerciseQuestion.questionId);
          const deletedOptions = await this.questionOptionRepository.findDeletedByQuestionId(exerciseQuestion.questionId);

          // Delete snapshot of deleted options
          if (deletedOptions.length) {
            await this.exerciseQuestionOptionSnapshotRepository.deleteByOptionIdsWithTransaction(
              transaction,
              deletedOptions.map((option) => option.id),
            );
          }

          for (const option of options) {
            // Update if option is exist
            const optionSnapshot = await this.exerciseQuestionOptionSnapshotRepository.getIdByOptionIdAndExerciseId(option.id, id);
            const optionSnapshotData = {
              text: option.text,
              isCorrect: option.isCorrect,
              capturedAt: new Date(),
              exerciseId: id,
              questionOptionId: option.id,
              exerciseQuestionSnapshotId: questionSnapshot.id,
            };

            if (optionSnapshot) {
              await this.exerciseQuestionOptionSnapshotRepository.updateWithTransaction(transaction, optionSnapshot.id, {
                ...optionSnapshotData,
                updatedBy: actorId,
                updatedAt: new Date(),
              });
            } else {
              console.log('wtf bro');
              // Insert new option snapshot with new option
              await this.exerciseQuestionOptionSnapshotRepository.insertWithTransaction(transaction, {
                ...optionSnapshotData,
                createdBy: actorId,
                createdAt: new Date(),
              });
            }
          }
        }
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE.SYNC_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
      message: 'Exercise synced successfully',
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
    // if (exercise.isActive) {
    //   const { code, status, message } = EXCEPTION.EXERCISE.CANNOT_UPDATE_ACTIVATED_EXERCISE;
    //   this.throwException({ code, status, message, actorId });
    // }
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const exerciseCount = await this.exerciseRepository.countById(id);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateActivate(id: number, actorId: number) {
    // Check exist
    const exercise = await this.exerciseRepository.getLessonIdAndIsActiveById(id);
    if (!exercise) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check isActive is false
    if (exercise.isActive) {
      const { code, status, message } = EXCEPTION.EXERCISE.ALREADY_ACTIVATED;
      this.throwException({ code, status, message, actorId });
    }

    // Activate at least 1 question
    const questionCount = await this.exerciseQuestionRepository.countByExerciseId(id);
    if (questionCount < 1) {
      const { code, status, message } = EXCEPTION.EXERCISE.CANNOT_ACTIVATE_WITHOUT_QUESTION;
      this.throwException({ code, status, message, actorId });
    }

    // Get lesson
    const lesson = await this.lessonRepository.getCourseNameById(exercise.lessonId);
    if (!lesson) {
      const { code, status, message } = EXCEPTION.LESSON.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
    return { lesson };
  }

  private async validateSync(id: number, actorId: number) {
    // Check exist
    const exerciseCount = await this.exerciseRepository.countById(id);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
