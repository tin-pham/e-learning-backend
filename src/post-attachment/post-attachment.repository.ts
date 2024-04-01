import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { PostAttachmentEntity } from './post-attachment.entity';

@Injectable()
export class PostAttachmentRepository {
  async insertMultipleWithTransaction(transaction: Transaction, data: PostAttachmentEntity[]) {
    return transaction.insertInto('postAttachment').values(data).execute();
  }

  deleteMultipleByAttachmentIdsWithTransaction(transaction: Transaction, attachmentIds: number[], actorId: number) {
    return transaction
      .updateTable('postAttachment')
      .where('attachmentId', 'in', attachmentIds)
      .where('deletedAt', 'is', null)
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .execute();
  }
}
