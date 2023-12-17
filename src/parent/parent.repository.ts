import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { USER_ROLE } from '../user-role/user-role.enum';
import { ParentEntity } from './parent.entity';
import { PaginationDTO } from '../common/dto/paginate.dto';

@Injectable()
export class ParentRepository {
  constructor(private readonly database: DatabaseService) {}

  storeWithTransaction(transaction: Transaction, entity: ParentEntity) {
    return transaction
      .insertInto('parent')
      .values(entity)
      .returning('id')
      .executeTakeFirstOrThrow();
  }

  find(filter: PaginationDTO) {
    const query = this.database
      .selectFrom('parent')
      .innerJoin('users', 'users.id', 'parent.userId')
      .innerJoin('userRole', 'users.id', 'userRole.userId')
      .innerJoin('role', 'userRole.roleId', 'role.id')
      .select([
        'users.username',
        'users.email',
        'users.phone',
        'users.displayName',
        'parent.id',
      ])
      .where('role.name', '=', USER_ROLE.PARENT)
      .where('users.deletedAt', 'is', null);

    return paginate(query, {
      limit: filter.limit,
      page: filter.page,
    });
  }

  findUserById(id: string) {
    return this.database
      .selectFrom('parent')
      .innerJoin('users', 'users.id', 'parent.userId')
      .selectAll('users')
      .where('parent.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  findOneById(id: string) {
    return this.database
      .selectFrom('parent')
      .innerJoin('users', 'users.id', 'parent.userId')
      .selectAll('parent')
      .where('parent.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  countById(id: string) {
    return this.database
      .selectFrom('parent')
      .innerJoin('users', 'users.id', 'parent.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('parent.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  getIdByUserId(userId: string) {
    return this.database
      .selectFrom('parent')
      .select('parent.id')
      .where('parent.userId', '=', userId)
      .executeTakeFirst();
  }

  getUserIdByParentId(id: string) {
    return this.database
      .selectFrom('parent')
      .select('parent.userId')
      .where('parent.id', '=', id)
      .executeTakeFirst();
  }
}
