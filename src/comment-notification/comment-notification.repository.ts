import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { CommentNotificationEntity } from './comment-notification.entity';

@Injectable()
export class CommentNotificationRepository {
  insertWithTransaction(transaction: Transaction, entity: CommentNotificationEntity) {
    return transaction.insertInto('commentNotification').values(entity).execute();
  }

  deleteByCommentIdWithTransaction(transaction: Transaction, commentId: number, actorId: number) {
    return transaction
      .updateTable('commentNotification')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('commentNotification.commentId', '=', commentId)
      .returning(['notificationId'])
      .execute();
  }
}
