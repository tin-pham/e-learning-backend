import { Injectable } from '@nestjs/common';
import { paginate } from '../common/function/paginate';
import { DatabaseService, Transaction } from '../database';
import { LessonCommentEntity } from './lesson-comment.entity';
import { LessonCommentGetListDTO } from './dto/lesson-comment.dto';

@Injectable()
export class LessonCommentRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: LessonCommentEntity) {
    return this.database
      .insertInto('lessonComment')
      .values(entity)
      .returning(['id', 'lessonId', 'userId', 'body', 'parentId'])
      .executeTakeFirst();
  }

  find(dto: LessonCommentGetListDTO) {
    const { page, limit } = dto;
    const query = this.database.selectFrom('lessonComment').select(['id', 'lessonId', 'userId', 'body', 'parentId']);

    return paginate(query, { limit, page });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('lessonComment')
      .select(['id', 'lessonId', 'userId', 'body', 'parentId'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('lessonComment')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('lessonComment.id', '=', id)
      .executeTakeFirst();
    return Number(count);
  }
}
