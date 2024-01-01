import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database/database.service';
import { TeacherSubjectEntity } from './teacher-subject.entity';

@Injectable()
export class TeacherSubjectRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMany(entities: TeacherSubjectEntity[]) {
    return this.database
      .insertInto('teacherSubject')
      .values(entities)
      .execute();
  }

  async countByTeacherIdsAndSubjectIds(
    teacherIds: string[],
    subjectIds: string[],
  ) {
    const { count } = await this.database
      .selectFrom('teacherSubject')
      .where('teacherId', 'in', teacherIds)
      .where('subjectId', 'in', subjectIds)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirstOrThrow();
    return Number(count);
  }

  async countByIds(ids: string[]) {
    const { count } = await this.database
      .selectFrom('teacherSubject')
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .select(({ fn }) => fn.countAll().as('count'))
      .executeTakeFirstOrThrow();
    return Number(count);
  }
}
