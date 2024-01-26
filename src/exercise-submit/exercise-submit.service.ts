import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ExerciseSubmitEntity } from './exercise-submit.entity';
import { ExerciseSubmitRepository } from './exercise-submit.repository';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { StudentRepository } from '../student/student.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseSubmitGetListDTO, ExerciseSubmitStoreDTO } from './dto/exercise-submit.dto';
import { ExerciseSubmitGetListDataRO, ExerciseSubmitStoreRO } from './ro/exercise-submit.ro';

@Injectable()
export class ExerciseSubmitService extends BaseService {
  private readonly logger = new Logger(ExerciseSubmitService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly exerciseSubmitRepository: ExerciseSubmitRepository,
    private readonly studentRepository: StudentRepository,
    private readonly exerciseRepository: ExerciseRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: ExerciseSubmitStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    const { student } = await this.validateStore(dto, actorId);

    let response: ExerciseSubmitStoreRO;

    try {
      const submitData = new ExerciseSubmitEntity({
        isSubmit: false,
        exerciseId: dto.exerciseId,
        createdBy: actorId,
        studentId: student.id,
      });
      const submit = await this.exerciseSubmitRepository.insert(submitData);

      response = new ExerciseSubmitStoreRO({
        id: submit.id,
        exerciseId: submit.exerciseId,
        isSubmit: submit.isSubmit,
        studentId: submit.studentId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseSubmitStoreRO,
      response,
      message: 'Submit stored successfully',
      actorId,
    });
  }

  async getList(dto: ExerciseSubmitGetListDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    try {
      const response = this.exerciseSubmitRepository.find(dto);

      return this.success({
        classRO: ExerciseSubmitGetListDataRO,
        response,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT.GET_LIST_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }
  }

  private async validateStore(dto: ExerciseSubmitStoreDTO, actorId: number) {
    // Check student exist
    const student = await this.studentRepository.getStudentIdByUserId(actorId);
    if (!student) {
      const { code, status, message } = EXCEPTION.STUDENT.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check exist
    const exerciseSubmitCount = await this.exerciseSubmitRepository.countByStudentId(student.id);
    if (exerciseSubmitCount) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT.ALREADY_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countById(dto.exerciseId);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }

    return { student };
  }
}
