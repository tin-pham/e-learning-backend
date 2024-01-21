import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { DirectoryEntity } from './directory.entity';
import { DirectoryGetListDTO } from './dto/directory.dto';

@Injectable()
export class DirectoryRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: DirectoryEntity, actorId: number) {
    return this.database
      .insertInto('directory')
      .values({ ...entity, createdBy: actorId, createdAt: new Date() })
      .returning(['id', 'name', 'parentId'])
      .executeTakeFirst();
  }

  find(dto: DirectoryGetListDTO) {
    const { directoryId } = dto;

    const withDirectory = Boolean(directoryId);

    return this.database
      .selectFrom('directory')
      .select(['id', 'name'])
      .where('deletedAt', 'is', null)
      .$if(withDirectory, (qb) => qb.where('parentId', '=', directoryId))
      .orderBy('name', 'asc')
      .execute();
  }

  update(id: number, entity: DirectoryEntity, actorId: number) {
    return this.database
      .updateTable('directory')
      .set({ ...entity, updatedBy: actorId, updatedAt: new Date() })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('directory')
      .set({ deletedBy: actorId, deletedAt: new Date() })
      .where('id', '=', id)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('directory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('directory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: number) {
    const { count } = await this.database
      .selectFrom('directory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
