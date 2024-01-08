import { Injectable, Logger } from '@nestjs/common';
import { BaseService } from '../base';
import { EXCEPTION, IJwtPayload } from '../common';
import { LEVEL } from './enum/level.enum';
import { GradeEntity } from '../grade/grade.entity';
import { ClassroomEntity } from '../classroom/classroom.entity';
import { DatabaseService, Transaction } from '../database';
import { GradeRepository } from '../grade/grade.repository';
import { ClassroomRepository } from '../classroom/classroom.repository';
import { ElasticsearchLoggerService } from '../elastic-search-logger/elastic-search-logger.service';
import { LevelChooseDTO } from './dto/level.dto';
import { LevelChooseRO } from './ro/level.ro';

@Injectable()
export class LevelService extends BaseService {
  private readonly logger = new Logger(LevelService.name);

  constructor(
    elasticLogger: ElasticsearchLoggerService,
    private readonly database: DatabaseService,
    private readonly gradeRepository: GradeRepository,
    private readonly classroomRepository: ClassroomRepository,
  ) {
    super(elasticLogger);
  }
  async choose(dto: LevelChooseDTO, decoded: IJwtPayload) {
    const actorId = decoded.userId;

    switch (dto.name) {
      case LEVEL.ELEMENTARY:
        return this.createSchool(1, 5, actorId);
      case LEVEL.MIDDLE:
        return this.createSchool(6, 9, actorId);
      case LEVEL.HIGH:
        return this.createSchool(10, 12, actorId);
      default:
        return null;
    }
  }

  private async createSchool(startGrade: number, endGrade: number, actorId: number) {
    try {
      await this.database.transaction().execute(async (transaction) => {
        const grades = await this.createGrades(transaction, startGrade, endGrade, actorId);
        await this.createClassrooms(transaction, grades, actorId);
      });
    } catch (error) {
      const { code, status, message } = EXCEPTION.LEVEL.CHOOSE_FAILED;
      this.logger.error(error);
      this.throwException({ code, status, message, actorId });
    }

    return this.success({
      classRO: LevelChooseRO,
      response: { result: true },
      message: 'Choose level successfully',
      actorId,
    });
  }

  private async createGrades(transaction: Transaction, startGrade: number, endGrade: number, actorId: number) {
    const gradesData = [];
    for (let i = startGrade; i <= endGrade; i++) {
      const grade = new GradeEntity();
      grade.name = `${i}`;
      grade.createdBy = actorId;
      gradesData.push(grade);
    }
    const grades = await this.gradeRepository.insertMultipleWithTransaction(transaction, gradesData);
    return grades;
  }

  private async createClassrooms(transaction: Transaction, grades: GradeEntity[], actorId: number) {
    const classrooms = [];
    for (const grade of grades) {
      for (let i = 1; i <= 5; i++) {
        const classroom = new ClassroomEntity();
        classroom.name = `${grade.name}A${i}`;
        classroom.gradeId = grade.id;
        classroom.createdBy = actorId;
        classrooms.push(classroom);
      }
    }
    await this.classroomRepository.insertMultipleWithTransaction(transaction, classrooms);
    return classrooms;
  }
}
