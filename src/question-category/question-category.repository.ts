import { Injectable } from '@nestjs/common';
import { DatabaseService } from '../database';
import { paginate } from '../common/function/paginate';
import { QuestionCategoryEntity } from './question-category.entity';
import { QuestionCategoryGetListDTO } from './dto/question-category.dto';

@Injectable()
export class QuestionCategoryRepository {
  constructor(private readonly database: DatabaseService) {}

  insert(entity: QuestionCategoryEntity) {
    return this.database.insertInto('questionCategory').values(entity).returning(['id', 'name']).executeTakeFirst();
  }

  find(dto: QuestionCategoryGetListDTO) {
    const { page, limit } = dto;
    const query = this.database
      .selectFrom('questionCategory')
      .where('questionCategory.deletedAt', 'is', null)
      .leftJoin('questionCategoryHasQuestion', (join) =>
        join
          .onRef('questionCategory.id', '=', 'questionCategoryHasQuestion.questionCategoryId')
          .on('questionCategoryHasQuestion.deletedAt', 'is', null),
      )
      .leftJoin('question', (join) =>
        join.onRef('questionCategoryHasQuestion.questionId', '=', 'question.id').on('question.deletedAt', 'is', null),
      )
      .groupBy('questionCategory.id')
      .select(({ fn }) => ['questionCategory.id as id', 'questionCategory.name as name', fn.count('question.id').as('questionCount')]);
    return paginate(query, { page, limit });
  }

  findOneById(id: number) {
    return this.database
      .selectFrom('questionCategory')
      .select(['id', 'name'])
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
  }

  update(id: number, entity: QuestionCategoryEntity) {
    return this.database
      .updateTable('questionCategory')
      .set(entity)
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id', 'name'])
      .executeTakeFirst();
  }

  delete(id: number, actorId: number) {
    return this.database
      .updateTable('questionCategory')
      .set({ deletedAt: new Date(), deletedBy: actorId })
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .returning(['id'])
      .executeTakeFirst();
  }

  async countByName(name: string) {
    const { count } = await this.database
      .selectFrom('questionCategory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countById(id: number) {
    const { count } = await this.database
      .selectFrom('questionCategory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', '=', id)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByIds(ids: number[]) {
    const { count } = await this.database
      .selectFrom('questionCategory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('id', 'in', ids)
      .where('deletedAt', 'is', null)
      .executeTakeFirst();
    return Number(count);
  }

  async countByNameExceptId(name: string, id: number) {
    const { count } = await this.database
      .selectFrom('questionCategory')
      .select(({ fn }) => fn.countAll().as('count'))
      .where('name', '=', name)
      .where('deletedAt', 'is', null)
      .where('id', '!=', id)
      .executeTakeFirst();
    return Number(count);
  }
}
