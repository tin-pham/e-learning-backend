import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { VideoEntity } from './video.entity';
import { VideoGetListDTO } from './dto/video.dto';
import { paginate } from 'src/common/function/paginate';

@Injectable()
export class VideoRepository {
  constructor(private readonly database: DatabaseService) {}

  find(dto: VideoGetListDTO) {
    const { page, limit } = dto;
    const query = this.database.selectFrom('video').select(['id', 'name', 'path', 'mimeType']).where('deletedAt', 'is', null).orderBy('id');

    return paginate(query, { page, limit });
  }

  insert(entity: VideoEntity) {
    return this.database.insertInto('video').values(entity).returning(['id', 'name', 'path', 'mimeType']).executeTakeFirst();
  }

  deleteMultipleByIds(ids: number[]) {
    return this.database.deleteFrom('video').where('id', 'in', ids).execute();
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('video')
      .select(['id', 'name', 'path', 'mimeType'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('video')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('video')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
