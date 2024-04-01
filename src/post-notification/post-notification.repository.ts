import { Injectable } from '@nestjs/common';
import { PostNotificationEntity } from './post-notification.entity';
import { Transaction } from '../database';

@Injectable()
export class PostNotificationRepository {
  insertWithTransaction(transaction: Transaction, entity: PostNotificationEntity) {
    return transaction.insertInto('postNotification').values(entity).execute();
  }
}
