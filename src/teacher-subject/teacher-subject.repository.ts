import { Injectable } from '@nestjs/common';
import { jsonBuildObject } from 'kysely/helpers/postgres';
import { DatabaseService } from '../database/database.service';
import { TeacherSubjectEntity } from './teacher-subject.entity';
import { TeacherSubjectGetListDTO } from './dto/teacher-subject.dto';
import { paginate } from 'src/common/function/paginate';

@Injectable()
export class TeacherSubjectRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMany(entities: TeacherSubjectEntity[]) {
    return this.database
      .insertInto('teacherSubject')
      .values(entities)
      .execute();
  }

  find(dto: TeacherSubjectGetListDTO) {
    const { page, limit, classroomYearId } = dto;
    const query = this.database
      .selectFrom('teacherSubject')
      .where('teacherSubject.deletedAt', 'is', null)
      .innerJoin('teacher', 'teacher.id', 'teacherSubject.teacherId')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .where('users.deletedAt', 'is', null)
      .innerJoin('subject', 'subject.id', 'teacherSubject.subjectId')
      .where('subject.deletedAt', 'is', null)
      .innerJoin(
        'classroomYearAssignment',
        'classroomYearAssignment.teacherSubjectId',
        'teacherSubject.id',
      )
      .where('classroomYearAssignment.classroomYearId', '=', classroomYearId)
      .where('classroomYearAssignment.deletedAt', 'is', null)
      .select(({ ref }) => [
        'teacherSubject.id',
        jsonBuildObject({
          id: ref('teacher.id'),
          username: ref('users.username'),
          email: ref('users.email'),
          phone: ref('users.phone'),
          displayName: ref('users.displayName'),
        }).as('teacher'),
        jsonBuildObject({
          id: ref('subject.id'),
          name: ref('subject.name'),
        }).as('subject'),
      ]);

    return paginate(query, {
      page,
      limit,
    });
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
