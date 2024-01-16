import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { FileEntity } from './file.entity';
import { FileGetListDTO } from './dto/file.dto';

@Injectable()
export class FileRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: FileGetListDTO) {
    const { limit, page } = dto;

    const query = this.database.selectFrom('file').select(['id', 'url']).where('deletedAt', 'is', null).orderBy('id');

    return paginate(query, { limit, page });
  }

  insertMultiple(entities: FileEntity[]) {
    return this.database.insertInto('file').values(entities).execute();
  }

  deleteMultipleByIds(ids: number[], actorId: number) {
    return this.database
      .updateTable('file')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .execute();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('file')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('file.id', '=', id)
      .where('file.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('file')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('file.id', 'in', ids)
      .where('file.deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
