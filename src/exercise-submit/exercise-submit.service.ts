import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { ExerciseRepository } from '../exercise/exercise.repository';
import { StudentRepository } from '../student/student.repository';
import { ExerciseSubmitRepository } from './exercise-submit.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { ExerciseSubmitStoreDTO } from './dto/exercise.dto';
import { ExerciseSubmitEntity } from './exercise-submit.entity';
import { ExerciseSubmitStoreRO } from './ro/exercise-submit.ro';

@Injectable()
export class ExerciseSubmitService extends BaseService {
  private readonly logger = new Logger(ExerciseSubmitService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly exerciseRepository: ExerciseRepository,
    private readonly studentRepository: StudentRepository,
    private readonly exerciseSubmitRepository: ExerciseSubmitRepository,
  ) {
    super(elasticLogger);
  }

  async store(dto: ExerciseSubmitStoreDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;
    await this.validateStore(dto, actorId);

    let response: ExerciseSubmitStoreRO;

    try {
      const student = await this.studentRepository.getStudentIdByUserId(actorId);

      const exerciseSubmitData = new ExerciseSubmitEntity({
        exerciseId: dto.exerciseId,
        studentId: student.id,
        isSubmit: false,
      });

      const exerciseSubmit = await this.exerciseSubmitRepository.insert(exerciseSubmitData);

      response = new ExerciseSubmitStoreRO({
        id: exerciseSubmit.id,
        exerciseId: exerciseSubmit.exerciseId,
        studentId: exerciseSubmit.studentId,
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.EXERCISE_SUBMIT.STORE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: ExerciseSubmitStoreRO,
      response,
      message: 'Exercise submit stored successfully',
      actorId,
    });
  }

  private async validateStore(dto: ExerciseSubmitStoreDTO, actorId: number) {
    // Check exercise exist
    const exerciseCount = await this.exerciseRepository.countById(dto.studentId);
    if (!exerciseCount) {
      const { code, status, message } = EXCEPTION.EXERCISE.DOES_NOT_EXIST;
      this.throwException({ code, status, message, actorId });
    }
  }
}
