import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { StudentEntity } from './student.entity';
import { USER_ROLE } from 'src/user-role/user-role.enum';
import { PaginationDTO } from 'src/common/dto/paginate.dto';

@Injectable()
export class StudentRepository {
  constructor(private readonly database: DatabaseService) {}

  storeWithTransaction(transaction: Transaction, entity: StudentEntity) {
    return transaction
      .insertInto('student')
      .values(entity)
      .returning('id')
      .executeTakeFirstOrThrow();
  }

  find(filter: PaginationDTO) {
    const query = this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .innerJoin('userRole', 'users.id', 'userRole.userId')
      .innerJoin('role', 'userRole.roleId', 'role.id')
      .select([
        'users.username',
        'users.email',
        'users.phone',
        'users.displayName',
        'student.id',
      ])
      .where('role.name', '=', USER_ROLE.STUDENT)
      .where('users.deletedAt', 'is', null);

    return paginate(query, {
      limit: filter.limit,
      page: filter.page,
    });
  }

  findOneById(id: string): Promise<StudentEntity> {
    return this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .select([
        'users.username',
        'users.email',
        'users.phone',
        'users.displayName',
        'student.id',
        'student.userId',
      ])
      .where('student.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  countById(id: string) {
    return this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('student.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  getIdByUserId(userId: string) {
    return this.database
      .selectFrom('student')
      .select('student.id')
      .where('student.userId', '=', userId)
      .executeTakeFirst();
  }
}
