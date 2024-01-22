import { Injectable } from '@nestjs/common';
import { DatabaseService, Transaction } from '../database';
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

  getRecursiveIds(id: number) {
    return this.database
      .withRecursive('directoryTree', (eb) =>
        eb
          .selectFrom('directory')
          .select(['id'])
          .where('deletedAt', 'is', null)
          .where('id', '=', id)
          .unionAll((eb) =>
            eb.selectFrom('directory').select(['directory.id']).innerJoin('directoryTree', 'directoryTree.id', 'directory.parentId'),
          ),
      )
      .selectFrom('directoryTree')
      .select('id')
      .execute();
  }

  deleteMultipleByIdsByTransaction(transaction: Transaction, ids: number[], actorId: number) {
    return transaction.updateTable('directory').set({ deletedAt: new Date(), deletedBy: actorId }).where('id', 'in', ids).execute();
  }

  getParentIdById(id: number) {
    return this.database
      .selectFrom('directory')
      .select(['parentId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  async countByNameAndParentId(name: string, parentId: number) {
    const { count } = await this.database
      .selectFrom('directory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('parentId', '=', parentId)
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

  async countByNameAndParentIdExceptId(name: string, parentId: number, id: number) {
    const { count } = await this.database
      .selectFrom('directory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('parentId', '=', parentId)
      .where('id', '!=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
