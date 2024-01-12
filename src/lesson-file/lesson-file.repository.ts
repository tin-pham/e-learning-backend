import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { LessonFileEntity } from './lesson-file.entity';

@Injectable()
export class LessonFileRepository {
  constructor(private readonly database: DatabaseService) {}

  insertMultiple(entities: LessonFileEntity[]) {
    return this.database.insertInto('lessonFile').values(entities).execute();
  }

  deleteMultipleByLessonIdsAndFileIds(lessonIds: number[], fileIds: number[], actorId: number) {
    return this.database
      .updateTable('lessonFile')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('lessonFile.lessonId', 'in', lessonIds)
      .where('lessonFile.fileId', 'in', fileIds)
      .where('lessonFile.createdBy', '=', actorId)
      .execute();
  }

  async countByLessonIdsAndFileIds(lessonIds: number[], fileIds: number[]) {
    const { count } = await this.database
      .selectFrom('lessonFile')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lessonFile.lessonId', 'in', lessonIds)
      .where('lessonFile.fileId', 'in', fileIds)
      .executeTakeFirst();
    return Number(count);
  }
}
