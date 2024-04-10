import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { ROLE } from '../role/enum/role.enum';
import { StudentEntity } from './student.entity';
import { StudentGetListDTO } from './dto/student.dto';

@Injectable()
export class StudentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertWithTransaction(transaction: Transaction, entity: StudentEntity) {
    return transaction.insertInto('student').values(entity).returning(['id']).executeTakeFirst();
  }

  updateWithTransaction(transaction: Transaction, id: string, entity: StudentEntity) {
    return transaction.updateTable('student').set(entity).where('id', '=', id).returning(['id']).executeTakeFirst();
  }

  find(dto: StudentGetListDTO) {
    const { page, limit, search } = dto;

    let query = this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .innerJoin('userRole', 'users.id', 'userRole.userId')
      .innerJoin('role', 'userRole.roleId', 'role.id')
      .leftJoin('userImage', (join) => join.onRef('users.id', '=', 'userImage.userId').on('userImage.deletedAt', 'is', null))
      .leftJoin('image', (join) => join.onRef('userImage.imageId', '=', 'image.id').on('image.deletedAt', 'is', null))
      .select(['users.username', 'users.email', 'users.phone', 'users.displayName', 'student.id', 'image.url as userImageUrl'])
      .where('role.name', '=', ROLE.STUDENT)
      .where('users.deletedAt', 'is', null)
      .orderBy('student.id', 'asc');

    if (search) {
      query = query.where((eb) =>
        eb.or([
          eb('users.username', 'like', `%${search}%`),
          eb('users.email', 'like', `%${search}%`),
          eb('users.phone', 'like', `%${search}%`),
          eb('users.displayName', 'like', `%${search}%`),
        ]),
      );
    }

    return paginate(query, {
      limit,
      page,
    });
  }

  findUserById(id: string) {
    return this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .selectAll('users')
      .where('student.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  findOneById(id: string) {
    return this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .selectAll('student')
      .where('student.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  findOneByUserId(userId: number) {
    return this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .selectAll('student')
      .where('student.userId', '=', userId)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  async countById(id: string) {
    const { count } = await this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('student.id', '=', id)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: string[]) {
    const { count } = await this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('student.id', 'in', ids)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  getUserIdByStudentId(id: string) {
    return this.database.selectFrom('student').select('student.userId').where('student.id', '=', id).executeTakeFirst();
  }

  getStudentIdByUserId(userId: number) {
    return this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .select(['student.id'])
      .where('student.userId', '=', userId)
      .where('users.deletedAt', 'is', null)
      .executeTakeFirst();
  }

  getUserIdsByStudentIds(studentIds: string[]) {
    return this.database
      .selectFrom('student')
      .innerJoin('users', 'users.id', 'student.userId')
      .select('users.id')
      .where('student.id', 'in', studentIds)
      .where('users.deletedAt', 'is', null)
      .execute();
  }
}
