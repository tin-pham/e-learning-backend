import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { StudentExerciseGradeRepository } from '../student-exercise-grade/student-exercise-grade.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseQuestionSnapshotRepository } from './exercise-question-snapshot.repository';
import { StudentExerciseRepository } from '../student-exercise/student-exercise.repository';
import { ExerciseQuestionSnapshotGetListDTO } from './dto/exercise-question-snapshot.dto';
import { ExerciseQuestionSnapshotGetListRO } from './ro/exercise-question-snapshot.ro';

@Injectable()
export class ExerciseQuestionSnapshotService extends BaseService {
  private readonly logger = new Logger(ExerciseQuestionSnapshotService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly exerciseQuestionSnapshotRepository: ExerciseQuestionSnapshotRepository,
    private readonly studentExerciseGradeRepository: StudentExerciseGradeRepository,
    private readonly studentExerciseRepository: StudentExerciseRepository,
  ) {
    super(elasticLogger);
  }

  async getList(dto: ExerciseQuestionSnapshotGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    try {
      const response = await this.exerciseQuestionSnapshotRepository.find(dto);
      return this.success({
        classRO: ExerciseQuestionSnapshotGetListRO,
        response,
        message: 'Get list exercise question snapshot successfully',
        actorId: decoded.userId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION_SNAPSHOT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  async studentGetList(dto: ExerciseQuestionSnapshotGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { isGraded, studentExercise } = await this.validateStudentGetList(dto, actorId);

    try {
      let response: any;
      if (isGraded) {
        response = await this.exerciseQuestionSnapshotRepository.findByStudentExerciseId(dto, studentExercise.id);
      } else {
        response = await this.exerciseQuestionSnapshotRepository.findWithoutOption(dto, studentExercise.id);
      }

      return this.success({
        classRO: ExerciseQuestionSnapshotGetListRO,
        response,
        message: 'Get list exercise question snapshot successfully',
        actorId: decoded.userId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_QUESTION_SNAPSHOT.STUDENT_GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateStudentGetList(dto: ExerciseQuestionSnapshotGetListDTO, actorId: number) {
    const studentExercise = await this.studentExerciseRepository.getIdByExerciseId(dto.exerciseId);

    if (!studentExercise) {
      const { code, status, message } = EXCEPTION.STUDENT_EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Is exercise graded
    const studentExerciseGradeCount = await this.studentExerciseGradeRepository.countByStudentExerciseId(studentExercise.id);
    let isGraded = false;
    if (studentExerciseGradeCount) {
      isGraded = true;
    }

    return { isGraded, studentExercise };
  }
}
