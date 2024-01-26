import { Injectable } from '@nestjs/common';
import { sql } from 'kysely';
import { DatabaseService } from '../database';
import { AssignmentAttachmentBulkStoreDTO } from './dto/assignment-attachment.dto';

@Injectable()
export class AssignmentAttachmentRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(dto: AssignmentAttachmentBulkStoreDTO, actorId: number) {
    return this.database
      .insertInto('assignmentAttachment')
      .columns(['url', 'assignmentId', 'createdBy'])
      .expression(() =>
        this.database.selectNoFrom(() => [
          sql`unnest(${dto.urls}::text[])`.as('url'),
          sql`${dto.assignmentId}`.as('assignmentId'),
          sql`${actorId}`.as('createdBy'),
        ]),
      )
      .execute();
  }

  async countByAssignmentIdsAndAttachmentIds(assignmentIds: number[], attachmentIds: number[]) {
    console.log(attachmentIds);
    const { count } = await this.database
      .selectFrom('assignmentAttachment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('assignmentId', 'in', assignmentIds)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }
}
