import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';
import { TeacherEntity } from './teacher.entity';
import { PaginationDTO } from '../common/dto/paginate.dto';

@Injectable()
export class TeacherRepository {
  constructor(private readonly database: DatabaseService) {}

  storeWithTransaction(transaction: Transaction, entity: TeacherEntity) {
    return transaction
      .insertInto('teacher')
      .values(entity)
      .returning('id')
      .executeTakeFirstOrThrow();
  }

  find(filter: PaginationDTO) {
    const query = this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .innerJoin('userRole', 'users.id', 'userRole.userId')
      .innerJoin('role', 'userRole.roleId', 'role.id')
      .select([
        'users.username',
        'users.email',
        'users.phone',
        'users.displayName',
        'teacher.id',
      ])
      .where('role.name', '=', USER_ROLE.TEACHER)
      .where('users.deletedAt', 'is', null);

    return paginate(query, {
      limit: filter.limit,
      page: filter.page,
    });
  }

  findUserById(id: string) {
    return this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .selectAll('users')
      .where('teacher.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  findOneById(id: string) {
    return this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .selectAll('teacher')
      .where('teacher.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  countById(id: string) {
    return this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('teacher.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  getIdByUserId(userId: string) {
    return this.database
      .selectFrom('teacher')
      .select('teacher.id')
      .where('teacher.userId', '=', userId)
      .executeTakeFirst();
  }

  getUserIdByTeacherId(id: string) {
    return this.database
      .selectFrom('teacher')
      .select('teacher.userId')
      .where('teacher.id', '=', id)
      .executeTakeFirst();
  }
}
