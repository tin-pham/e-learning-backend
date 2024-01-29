import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { AssignmentEntity } from './assignment.entity';
import { AssignmentGetListDTO } from './dto/assignment.dto';

@Injectable()
export class AssignmentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, assignment: AssignmentEntity) {
    return transaction.insertInto('assignment').values(assignment).returning(['id', 'name', 'dueDate', 'description']).executeTakeFirst();
  }

  find(dto: AssignmentGetListDTO) {
    const { limit, page } = dto;
    const query = this.database
      .selectFrom('assignment')
      .select(['id', 'name', 'dueDate', 'description', 'courseId'])
      .where('deletedAt', 'is', null)
      .orderBy('id', 'asc');

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('assignment')
      .select(['id', 'name', 'dueDate', 'description', 'courseId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  update(id: number, assignment: AssignmentEntity) {
    return this.database
      .updateTable('assignment')
      .set(assignment)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name', 'dueDate', 'description', 'courseId'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('assignment')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('assignment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('assignment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
