import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { ROLE } from '../role/enum/role.enum';
import { TeacherEntity } from './teacher.entity';
import { TeacherGetListDTO } from './dto/teacher.dto';

@Injectable()
export class TeacherRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: TeacherEntity) {
    return transaction.insertInto('teacher').values(entity).returning('id').executeTakeFirstOrThrow();
  }

  find(dto: TeacherGetListDTO) {
    const { limit, page } = dto;

    const query = this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .innerJoin('userRole', 'users.id', 'userRole.userId')
      .innerJoin('role', 'userRole.roleId', 'role.id')
      .leftJoin('userImage', (join) => join.onRef('users.id', '=', 'userImage.userId').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('userImage.imageId', '=', 'image.id').on('image.deletedAt', 'is', null))
      .select(['users.username', 'users.email', 'users.phone', 'users.displayName', 'teacher.id', 'image.url as userImageUrl'])
      .where('role.name', '=', ROLE.TEACHER)
      .where('users.deletedAt', 'is', null);

    return paginate(query, {
      limit,
      page,
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

  async countById(id: string) {
    const { count } = await this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('teacher.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: string[]) {
    const { count } = await this.database
      .selectFrom('teacher')
      .innerJoin('users', 'users.id', 'teacher.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('teacher.id', 'in', ids)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  getIdByUserId(userId: number) {
    return this.database.selectFrom('teacher').select('teacher.id').where('teacher.userId', '=', userId).executeTakeFirst();
  }

  getUserIdByTeacherId(id: string) {
    return this.database.selectFrom('teacher').select('teacher.userId').where('teacher.id', '=', id).executeTakeFirst();
  }
}
