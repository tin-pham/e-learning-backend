import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { StudentExerciseGradeEntity } from './student-exercise-grade.entity';
import { StudentExerciseGradeRepository } from './student-exercise-grade.repository';
import { StudentExerciseRepository } from '../student-exercise/student-exercise.repository';
import { ExerciseQuestionSnapshotRepository } from '../exercise-question-snapshot/exercise-question-snapshot.repository';
import { ExerciseQuestionOptionSnapshotRepository } from '../exercise-question-option-snapshot/exercise-question-option-snapshot.repository';
import { StudentExerciseOptionRepository } from 'src/student-exercise-option/student-exercise-option.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { StudentExerciseGradeCalculateDTO } from './dto/student-exercise-grade.dto';
import { StudentExerciseGradeCalculateRO, StudentExerciseGradeDeleteRO } from './ro/student-exercise-grade.ro';

@Injectable()
export class StudentExerciseGradeService extends BaseService {
  private readonly logger = new Logger(StudentExerciseGradeService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly studentExerciseGradeRepository: StudentExerciseGradeRepository,
    private readonly studentExerciseRepository: StudentExerciseRepository,
    private readonly exerciseQuestionSnapshotRepository: ExerciseQuestionSnapshotRepository,
    private readonly exerciseQuestionOptionSnapshotRepository: ExerciseQuestionOptionSnapshotRepository,
    private readonly studentExerciseOptionRepository: StudentExerciseOptionRepository,
  ) {
    super(elasticLogger);
  }

  async calculate(dto: StudentExerciseGradeCalculateDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { studentExercise, questionIds } = await this.validateCalculate(dto, actorId);
    let response: StudentExerciseGradeCalculateRO;

    try {
      const studentExerciseGradeData = new StudentExerciseGradeEntity();
      studentExerciseGradeData.correctCount = 0;
      studentExerciseGradeData.studentExerciseId = studentExercise.id;
      studentExerciseGradeData.totalCount = questionIds.length;

      for (const questionId of questionIds) {
        // Get correct question option
        const correctQuestionOptions = await this.exerciseQuestionOptionSnapshotRepository.getCorrectIdByQuestionId(questionId);
        const correctQuestionOptionIds = correctQuestionOptions.map((option) => option.id);

        // Get student exercise option (snapshot)
        const studentExerciseOptions = await this.studentExerciseOptionRepository.getQuestionOptionByStudentExerciseIdAndQuestionId(
          studentExercise.id,
          questionId,
        );
        const studentExerciseOptionIds = studentExerciseOptions.map((option) => option.questionOptionSnapshotId);

        // Compare
        if (correctQuestionOptionIds.every((optionId) => studentExerciseOptionIds.includes(optionId))) {
          studentExerciseGradeData.correctCount += 1;
        }
      }

      studentExerciseGradeData.point = (studentExerciseGradeData.correctCount / studentExerciseGradeData.totalCount) * dto.basePoint;

      const studentExerciseGrade = await this.studentExerciseGradeRepository.insert(studentExerciseGradeData);

      response = new StudentExerciseGradeCalculateRO({
        id: studentExerciseGrade.id,
        point: studentExerciseGrade.point,
        correctCount: studentExerciseGrade.correctCount,
        totalCount: studentExerciseGrade.totalCount,
        studentExerciseId: studentExerciseGrade.studentExerciseId,
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

  private async validateCalculate(dto: StudentExerciseGradeCalculateDTO, actorId: number) {
    // Check unique
    const studentExerciseGradeCount = await this.studentExerciseGradeRepository.countByStudentExerciseId(dto.studentExerciseId);
    if (studentExerciseGradeCount) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE_GRADE.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }

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
    const questions = await this.exerciseQuestionSnapshotRepository.getIdsByExerciseId(studentExercise.exerciseId);

    if (!questions.length) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION_SNAPSHOT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
    const questionIds = questions.map((question) => question.id);

    return { studentExercise, questionIds };
  }

  private async validateDelete(id: number, actorId: number) {
    // Check exist
    const studentExerciseGradeCount = await this.studentExerciseGradeRepository.countById(id);
    if (!studentExerciseGradeCount) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE_GRADE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
