import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { CommentNotificationEntity } from './comment-notification.entity';

@Injectable()
export class CommentNotificationRepository {
  insertWithTransaction(transaction: Transaction, entity: CommentNotificationEntity) {
    return transaction.insertInto('commentNotification').values(entity).execute();
  }
}
