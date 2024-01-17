import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { AttachmentEntity } from './attachment.entity';
import { AttachmentGetListDTO } from './dto/attachment.dto';

@Injectable()
export class AttachmentRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: AttachmentGetListDTO) {
    const { page, limit } = dto;
    const query = this.database
      .selectFrom('attachment')
      .select(['id', 'name', 'path', 'mimeType'])
      .where('deletedAt', 'is', null)
      .orderBy('id');

    return paginate(query, { page, limit });
  }

  insert(entity: AttachmentEntity) {
    return this.database.insertInto('attachment').values(entity).returning(['id', 'name', 'path', 'mimeType']).executeTakeFirst();
  }

  deleteMultipleByIds(ids: number[]) {
    return this.database.deleteFrom('attachment').where('id', 'in', ids).execute();
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('attachment')
      .select(['id', 'name', 'path', 'mimeType'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('attachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('attachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
