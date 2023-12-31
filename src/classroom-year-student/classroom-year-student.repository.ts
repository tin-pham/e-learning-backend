import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { ClassroomYearStudentEntity } from './classroom-year-student.entity';

@Injectable()
export class ClassroomYearStudentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMany(entities: ClassroomYearStudentEntity[]) {
    return this.database
      .insertInto('classroomYearStudent')
      .values(entities)
      .execute();
  }
}
