import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { DatabaseService } from '../database';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { StudentRepository } from '../student/student.repository';
import { StudentExerciseRepository } from './student-exercise.repository';
import { StudentExerciseOptionRepository } from '../student-exercise-option/student-exercise-option.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { StudentExerciseStoreDTO, StudentExerciseSubmitDTO } from './dto/student-exercise.dto';
import { StudentExerciseEntity } from './student-exercise.entity';
import { ResultRO } from '../common/ro/result.ro';

@Injectable()
export class StudentExerciseService extends BaseService {
  private readonly logger = new Logger(StudentExerciseService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly studentRepository: StudentRepository,
    private readonly studentExerciseRepository: StudentExerciseRepository,
    private readonly exerciseQuestionSnapshotRepository: ExerciseQuestionSnapshotRepository,
    private readonly exerciseQuestionOptionSnapshotRepository: ExerciseQuestionOptionSnapshotRepository,
    private readonly studentExerciseOptionRepository: StudentExerciseOptionRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: StudentExerciseStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { student } = await this.validateStore(dto, actorId);

    try {
      const studentExerciseData = new StudentExerciseEntity();
      studentExerciseData.exerciseId = dto.exerciseId;
      studentExerciseData.studentId = student.id;
      studentExerciseData.createdBy = actorId;
      await this.studentExerciseRepository.insert(studentExerciseData);
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ResultRO,
      response: { result: true },
    });
  }

  async submit(id: number, dto: StudentExerciseSubmitDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { studentExercise } = await this.validateSubmit(id, dto, actorId);

    try {
      await this.database.transaction().execute(async (transaction) => {
        const studentExerciseData = new StudentExerciseEntity();
        studentExerciseData.updatedBy = actorId;
        studentExerciseData.updatedAt = new Date();
        studentExerciseData.isSubmitted = true;
        studentExerciseData.submittedAt = new Date();
        // Is late
        if (studentExercise.exerciseDueDate < studentExerciseData.submittedAt) {
          studentExerciseData.isLate = true;
        }
        await this.studentExerciseRepository.updateWithTransaction(transaction, id, studentExerciseData);

        for (const questionSnapshot of dto.snapshotQuestions) {
          await this.studentExerciseOptionRepository.insertMultipleQuestionOptionIdsWithTransaction({
            questionSnapshotId: questionSnapshot.id,
            questionOptionSnapshotIds: questionSnapshot.snapshotOptionIds,
            studentExerciseId: id,
            transaction,
          });
        }
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

  // TODO: RO
  async getListSubmitted(decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const studentExercises = await this.studentExerciseRepository.findBySubmitted();
      return studentExercises;
    } catch (error) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.GET_SUBMITTED_LIST_FAILED;
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

    return { student };
  }

  private async validateSubmit(id: number, dto: StudentExerciseSubmitDTO, actorId: number) {
    // Get exercise by id
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
    const exerciseQuestionSnapshotCount = await this.exerciseQuestionSnapshotRepository.countByIds(snapshotQuestionIds);
    if (!exerciseQuestionSnapshotCount) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION_SNAPSHOT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check question options exist
    const exerciseQuestionOptionSnapshotCount = await this.exerciseQuestionOptionSnapshotRepository.countByIds(snapshotOptionIds);
    if (!exerciseQuestionOptionSnapshotCount) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION_OPTION_SNAPSHOT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return { studentExercise };
  }
}