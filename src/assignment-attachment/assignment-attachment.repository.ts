import { Injectable } from '@nestjs/common';
import { Transaction } from '../database';
import { AssignmentAttachmentEntity } from './assignment-attachment.entity';

@Injectable()
export class AssignmentAttachmentRepository {
  insertMultipleWithTransaction(transaction: Transaction, entities: AssignmentAttachmentEntity[]) {
    return transaction.insertInto('assignmentAttachment').values(entities).execute();
  }
}
