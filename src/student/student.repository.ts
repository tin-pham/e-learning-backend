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
      .executeTakeFirstOrThrow();
  }

  find(filter: PaginationDTO) {
    const query = this.database
      .selectFrom('users')
      .innerJoin('userRole', 'users.id', 'userRole.userId')
      .innerJoin('role', 'userRole.roleId', 'role.id')
      .selectAll('users')
      .where('role.name', '=', USER_ROLE.STUDENT)
      .where('users.deletedAt', 'is', null);

    return paginate(query, {
      limit: filter.limit,
      page: filter.page,
    });
  }
}
