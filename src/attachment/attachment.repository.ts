import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService } from '../database';
import { AttachmentEntity } from './attachment.entity';
import { AttachmentGetListDTO } from './dto/attachment.dto';

@Injectable()
export class AttachmentRepository {
  constructor(private readonly database: DatabaseService) {}

  getPaths() {
    return this.database.selectFrom('attachment').select(['path']).where('deletedAt', 'is', null).execute();
  }

  getPathsByDirectoryIds(directoryIds: number[]) {
    return this.database
      .selectFrom('attachment')
      .select(['path'])
      .where('deletedAt', 'is', null)
      .where('directoryId', 'in', directoryIds)
      .execute();
  }

  find(dto: AttachmentGetListDTO) {
    const { page, limit, lessonId, directoryId } = dto;

    const withLesson = Boolean(lessonId);
    const withDirectory = Boolean(directoryId);

    const query = this.database
      .selectFrom('attachment')
      .select(['attachment.id', 'attachment.name', 'attachment.path', 'attachment.mimeType'])
      .where('attachment.deletedAt', 'is', null)
      .orderBy('attachment.id')
      .$if(withLesson, (qb) =>
        qb
          .innerJoin('lessonAttachment', 'lessonAttachment.attachmentId', 'attachment.id')
          .where('lessonAttachment.deletedAt', 'is', null)
          .innerJoin('lesson', 'lesson.id', 'lessonAttachment.lessonId')
          .where('lesson.deletedAt', 'is', null)
          .where('lesson.id', '=', lessonId),
      )
      .$if(withDirectory, (qb) =>
        qb
          .innerJoin('directory', 'directory.id', 'attachment.directoryId')
          .where('directory.deletedAt', 'is', null)
          .where('directory.id', '=', directoryId),
      );

    return paginate(query, { page, limit });
  }

  insert(entity: AttachmentEntity) {
    return this.database.insertInto('attachment').values(entity).returning(['id', 'name', 'path', 'mimeType']).executeTakeFirst();
  }

  deleteMultipleByIds(ids: number[]) {
    return this.database.deleteFrom('attachment').where('id', 'in', ids).execute();
  }

  deleteMultipleByDirectoryIdsByTransaction(transaction: any, directoryIds: number[]) {
    return transaction.deleteFrom('attachment').where('directoryId', 'in', directoryIds).execute();
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
